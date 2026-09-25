export type ImageOutputFormat =
  | "webp"
  | "jpeg"
  | "png"
  | "avif";

export interface ImageCompressionResult {
  success: boolean;
  blob: Blob | null;
  originalSize: number;
  compressedSize: number;
  reduction: number;
  error: string | null;
  outputType: string | null;
}

interface CompressImageOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: ImageOutputFormat;
}

export async function compressImage(
  file: File,
  options: CompressImageOptions = {}
): Promise<ImageCompressionResult> {
  const {
    quality = 75,
    maxWidth = 2400,
    maxHeight = 2400,
    format = "webp",
  } = options;

  const originalSize = file.size;

  /* Validate file */

  if (!file.type.startsWith("image/")) {
    return failureResult(
      originalSize,
      "Please select a valid image file."
    );
  }

  try {
    /*
     * Load image through browser.
     *
     * This allows browser-supported image
     * formats such as JPG, PNG, WebP, GIF,
     * SVG and AVIF to be rasterized.
     */
    const image =
      await loadImage(file);

    let width =
      image.naturalWidth;

    let height =
      image.naturalHeight;

    if (!width || !height) {
      return failureResult(
        originalSize,
        "Unable to determine image dimensions."
      );
    }

    /*
     * Keep aspect ratio.
     */
    const scale = Math.min(
      1,
      maxWidth / width,
      maxHeight / height
    );

    width = Math.max(
      1,
      Math.round(width * scale)
    );

    height = Math.max(
      1,
      Math.round(height * scale)
    );

    /*
     * Create canvas.
     */
    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width = width;
    canvas.height = height;

    const context =
      canvas.getContext("2d");

    if (!context) {
      return failureResult(
        originalSize,
        "Unable to create image canvas."
      );
    }

    context.imageSmoothingEnabled =
      true;

    context.imageSmoothingQuality =
      "high";

    /*
     * JPEG doesn't support transparency.
     * Use white background.
     */
    if (format === "jpeg") {
      context.fillStyle =
        "#ffffff";

      context.fillRect(
        0,
        0,
        width,
        height
      );
    }

    /*
     * Draw image.
     */
    context.drawImage(
      image,
      0,
      0,
      width,
      height
    );

    const outputType =
      getMimeType(format);

    const normalizedQuality =
      Math.min(
        100,
        Math.max(10, quality)
      ) / 100;

    /*
     * PNG is lossless.
     * Quality is not passed.
     */
    const blobQuality =
      format === "png"
        ? undefined
        : normalizedQuality;

    let compressedBlob =
      await canvasToBlob(
        canvas,
        outputType,
        blobQuality
      );

    if (!compressedBlob) {
      return failureResult(
        originalSize,
        "Unable to compress image."
      );
    }

    /*
     * IMPORTANT:
     *
     * If browser doesn't support requested
     * format, canvas.toBlob() can fall back
     * to PNG.
     *
     * Don't silently accept that fallback.
     */
    if (
      compressedBlob.type !==
      outputType
    ) {
      return failureResult(
        originalSize,
        `${format.toUpperCase()} output is not supported by this browser.`
      );
    }

    /*
     * For lossy formats, if the result is
     * not smaller, try stronger compression.
     */
    if (
      compressedBlob.size >=
        originalSize &&
      format !== "png"
    ) {
      const strongerQuality =
        Math.max(
          0.2,
          normalizedQuality - 0.2
        );

      const strongerBlob =
        await canvasToBlob(
          canvas,
          outputType,
          strongerQuality
        );

      if (
        strongerBlob &&
        strongerBlob.type ===
          outputType &&
        strongerBlob.size <
          compressedBlob.size
      ) {
        compressedBlob =
          strongerBlob;
      }
    }

    /*
     * If compressed output is still
     * larger than original, keep original.
     *
     * This prevents showing negative
     * compression results.
     */
    if (
      compressedBlob.size >=
      originalSize
    ) {
      return {
        success: true,
        blob: file,
        originalSize,
        compressedSize:
          originalSize,
        reduction: 0,
        error: null,
        outputType: file.type,
      };
    }

    const compressedSize =
      compressedBlob.size;

    const reduction =
      originalSize > 0
        ? Math.max(
            0,
            ((originalSize -
              compressedSize) /
              originalSize) *
              100
          )
        : 0;

    return {
      success: true,
      blob: compressedBlob,
      originalSize,
      compressedSize,
      reduction,
      error: null,
      outputType,
    };
  } catch {
    return failureResult(
      originalSize,
      "Unable to process this image. The image format may not be supported by your browser."
    );
  }
}

/* -------------------------------- */
/* Failure Result */
/* -------------------------------- */

function failureResult(
  originalSize: number,
  error: string
): ImageCompressionResult {
  return {
    success: false,
    blob: null,
    originalSize,
    compressedSize: 0,
    reduction: 0,
    error,
    outputType: null,
  };
}

/* -------------------------------- */
/* MIME Type */
/* -------------------------------- */

function getMimeType(
  format: ImageOutputFormat
): string {
  switch (format) {
    case "jpeg":
      return "image/jpeg";

    case "png":
      return "image/png";

    case "avif":
      return "image/avif";

    case "webp":
    default:
      return "image/webp";
  }
}

/* -------------------------------- */
/* Canvas → Blob */
/* -------------------------------- */

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
): Promise<Blob | null> {
  return new Promise(
    (resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        type,
        quality
      );
    }
  );
}

/* -------------------------------- */
/* Load Image */
/* -------------------------------- */

function loadImage(
  file: File
): Promise<HTMLImageElement> {
  return new Promise(
    (resolve, reject) => {
      const objectUrl =
        URL.createObjectURL(file);

      const image =
        new Image();

      image.onload = () => {
        URL.revokeObjectURL(
          objectUrl
        );

        resolve(image);
      };

      image.onerror = () => {
        URL.revokeObjectURL(
          objectUrl
        );

        reject(
          new Error(
            "Unable to load image."
          )
        );
      };

      image.src = objectUrl;
    }
  );
}