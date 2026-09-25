"use client";

import {
  useRef,
  useState,
} from "react";

import {
  compressImage,
  type ImageOutputFormat,
  type ImageCompressionResult,
} from "@/lib/image/compressor";

interface ImageCompressorProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

interface Toast {
  type: "success" | "error" | "info";
  message: string;
}

export default function ImageCompressor({
  theme,
  onToggleTheme,
}: ImageCompressorProps) {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [compressedUrl, setCompressedUrl] =
    useState<string | null>(null);

  const [result, setResult] =
    useState<ImageCompressionResult | null>(
      null
    );

  const [quality, setQuality] =
    useState(75);

  const [outputFormat, setOutputFormat] =
    useState<ImageOutputFormat>("webp");

  const [isCompressing, setIsCompressing] =
    useState(false);

  const [toast, setToast] =
    useState<Toast | null>(null);

  const showToast = (
    type: Toast["type"],
    message: string
  ) => {
    setToast({
      type,
      message,
    });

    window.setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showToast(
        "error",
        "Please select a valid image file."
      );

      event.target.value = "";
      return;
    }

    /* Remove old URLs */

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl);
    }

    const newPreviewUrl =
      URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(newPreviewUrl);
    setCompressedUrl(null);
    setResult(null);

    showToast(
      "success",
      "Image uploaded successfully."
    );

    /*
     * Reset input so the same file
     * can be selected again.
     */
    event.target.value = "";
  };

  const handleCompress = async () => {
    if (!selectedFile) {
      showToast(
        "error",
        "Please upload an image first."
      );

      return;
    }

    setIsCompressing(true);
    setResult(null);

    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl);
      setCompressedUrl(null);
    }

    const compressionResult =
      await compressImage(
        selectedFile,
        {
          quality,
          format: outputFormat,
          maxWidth: 2400,
          maxHeight: 2400,
        }
      );

    setIsCompressing(false);
    setResult(compressionResult);

    if (!compressionResult.success) {
      showToast(
        "error",
        compressionResult.error ||
          "Unable to compress image."
      );

      return;
    }

    if (!compressionResult.blob) {
      showToast(
        "error",
        "Compressed image is unavailable."
      );

      return;
    }

    const url =
      URL.createObjectURL(
        compressionResult.blob
      );

    setCompressedUrl(url);

    if (compressionResult.reduction > 0) {
      showToast(
        "success",
        `Image compressed successfully. ${compressionResult.reduction.toFixed(
          1
        )}% size reduced.`
      );
    } else {
      showToast(
        "info",
        "The compressed file was not smaller than the original."
      );
    }
  };

  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(null);
    setCompressedUrl(null);
    setResult(null);
    setQuality(75);
    setOutputFormat("webp");
    setToast(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = () => {
    if (!result?.blob) {
      showToast(
        "error",
        "Please compress an image first."
      );

      return;
    }

    const extension =
      getExtension(
        result.outputType
      );

    const originalName =
      selectedFile?.name
        .replace(/\.[^/.]+$/, "") ||
      "compressed-image";

    const fileName =
      `${originalName}-compressed.${extension}`;

    const url =
      URL.createObjectURL(result.blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;
    anchor.download = fileName;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);

    showToast(
      "success",
      "Compressed image downloaded."
    );
  };

  return (
    <div className="w-full">

  {/* Action Row */}

      <div className="mb-5 flex items-center justify-between gap-4 overflow-x-auto">

        {/* Left Buttons */}

        <div className="flex shrink-0 items-center gap-3">

          {/* Compress */}

          <button
            type="button"
            onClick={handleCompress}
            disabled={
              !selectedFile ||
              isCompressing
            }
            className={`
              cursor-pointer
              rounded-xl
              px-5
              py-2.5
              text-sm
              font-medium
              shadow-sm
              transition
              disabled:cursor-not-allowed
              disabled:opacity-50
              ${
                theme === "dark"
                  ? `
                    bg-white
                    text-black
                    hover:bg-zinc-200
                    disabled:bg-zinc-700
                    disabled:text-zinc-400
                  `
                  : `
                    bg-black
                    text-white
                    hover:bg-zinc-800
                    disabled:bg-zinc-300
                    disabled:text-zinc-500
                  `
              }
            `}
          >
            {isCompressing
              ? "Compressing..."
              : "Compress Image"}
          </button>

          {/* Upload */}

          <button
            type="button"
            onClick={handleUploadClick}
            className={`
              cursor-pointer
              shrink-0
              rounded-xl
              border
              px-4
              py-2.5
              text-sm
              font-medium
              transition
              ${
                theme === "dark"
                  ? `
                    border-zinc-700
                    bg-zinc-900
                    text-zinc-100
                    hover:bg-zinc-800
                  `
                  : `
                    border-zinc-300
                    bg-white
                    text-zinc-900
                    hover:bg-zinc-100
                  `
              }
            `}
          >
            {selectedFile
              ? "Upload Another Image"
              : "Upload File"}
          </button>

          {/* Clear */}

          <button
            type="button"
            onClick={handleClear}
            disabled={!selectedFile}
            className={`
              cursor-pointer
              shrink-0
              rounded-xl
              border
              px-4
              py-2.5
              text-sm
              font-medium
              transition
              disabled:cursor-not-allowed
              disabled:opacity-50
              ${
                theme === "dark"
                  ? `
                    border-red-900
                    bg-zinc-900
                    text-red-400
                    hover:bg-red-950
                  `
                  : `
                    border-red-200
                    bg-white
                    text-red-600
                    hover:bg-red-50
                  `
              }
            `}
          >
            Clear
          </button>

          {/* Hidden Input */}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

      
      </div>

      {/* Image Input */}

      <h2
        className={`
          mb-3
          text-xl
          font-bold
          ${
            theme === "dark"
              ? "text-zinc-100"
              : "text-zinc-900"
          }
        `}
      >
        Image Input
      </h2>

    

      {/* Image Input Box */}

      <div
        className={`
          overflow-hidden
          rounded-xl
          border
          shadow-sm
          ${
            theme === "dark"
              ? "border-zinc-700 bg-zinc-900"
              : "border-zinc-300 bg-white"
          }
        `}
      >
        {!selectedFile ? (
          <button
            type="button"
            onClick={handleUploadClick}
            className={`
              flex
              min-h-[320px]
              w-full
              cursor-pointer
              flex-col
              items-center
              justify-center
              px-6
              text-center
              transition
              ${
                theme === "dark"
                  ? "hover:bg-zinc-800"
                  : "hover:bg-zinc-50"
              }
            `}
          >
            <div className="mb-4 text-5xl">
              🖼️
            </div>

            <p
              className={`
                text-base
                font-medium
                ${
                  theme === "dark"
                    ? "text-zinc-100"
                    : "text-zinc-900"
                }
              `}
            >
              Upload an image
            </p>

            <p
              className={`
                mt-2
                text-sm
                ${
                  theme === "dark"
                    ? "text-zinc-400"
                    : "text-zinc-500"
                }
              `}
            >
              JPG, PNG, WebP, GIF, SVG,
              AVIF and other supported images
            </p>
          </button>
        ) : (
          <div className="p-5">

            {/* Preview */}

            {previewUrl && (
              <div
                className={`
                  flex
                  min-h-[280px]
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  border
                  p-4
                  ${
                    theme === "dark"
                      ? "border-zinc-700 bg-zinc-950"
                      : "border-zinc-200 bg-zinc-50"
                  }
                `}
              >
                <img
                  src={previewUrl}
                  alt="Selected image preview"
                  className="max-h-[420px] max-w-full rounded-lg object-contain"
                />
              </div>
            )}

            {/* File Information */}

            <div className="mt-4">
              <p
                className={`
                  truncate
                  text-sm
                  font-medium
                  ${
                    theme === "dark"
                      ? "text-zinc-100"
                      : "text-zinc-900"
                  }
                `}
              >
                {selectedFile.name}
              </p>

              <p
                className={`
                  mt-1
                  text-xs
                  ${
                    theme === "dark"
                      ? "text-zinc-400"
                      : "text-zinc-500"
                  }
                `}
              >
                {formatBytes(
                  selectedFile.size
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Compression Settings */}

      {selectedFile && (
        <div
          className={`
            mt-6
            rounded-xl
            border
            p-5
            ${
              theme === "dark"
                ? "border-zinc-700 bg-zinc-900"
                : "border-zinc-300 bg-white"
            }
          `}
        >
          <div className="grid gap-5 md:grid-cols-2">

            {/* Output Format */}

            <div>
              <label
                className={`
                  mb-2
                  block
                  text-sm
                  font-medium
                  ${
                    theme === "dark"
                      ? "text-zinc-100"
                      : "text-zinc-900"
                  }
                `}
              >
                Output Format
              </label>

              <select
                value={outputFormat}
                onChange={(event) =>
                  setOutputFormat(
                    event.target
                      .value as ImageOutputFormat
                  )
                }
                className={`
                  w-full
                  rounded-xl
                  border
                  px-4
                  py-2.5
                  text-sm
                  outline-none
                  ${
                    theme === "dark"
                      ? `
                        border-zinc-700
                        bg-zinc-950
                        text-zinc-100
                      `
                      : `
                        border-zinc-300
                        bg-white
                        text-zinc-900
                      `
                  }
                `}
              >
                <option value="webp">
                  WebP - Recommended
                </option>

                <option value="jpeg">
                  JPEG / JPG
                </option>

                <option value="png">
                  PNG - Lossless
                </option>

                <option value="avif">
                  AVIF - High Compression
                </option>
              </select>
            </div>

            {/* Quality */}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  className={`
                    text-sm
                    font-medium
                    ${
                      theme === "dark"
                        ? "text-zinc-100"
                        : "text-zinc-900"
                    }
                  `}
                >
                  Quality
                </label>

                <span
                  className={`
                    text-sm
                    font-medium
                    ${
                      theme === "dark"
                        ? "text-zinc-300"
                        : "text-zinc-700"
                    }
                  `}
                >
                  {quality}%
                </span>
              </div>

              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={quality}
                onChange={(event) =>
                  setQuality(
                    Number(event.target.value)
                  )
                }
                disabled={
                  outputFormat === "png"
                }
                className="w-full cursor-pointer"
              />

              {outputFormat === "png" && (
                <p
                  className={`
                    mt-2
                    text-xs
                    ${
                      theme === "dark"
                        ? "text-zinc-500"
                        : "text-zinc-500"
                    }
                  `}
                >
                  PNG uses lossless canvas
                  encoding, so quality does
                  not affect PNG output.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Result */}

      {result?.success && (
        <div
          className={`
            mt-6
            rounded-xl
            border
            p-5
            ${
              theme === "dark"
                ? "border-zinc-700 bg-zinc-900"
                : "border-zinc-300 bg-white"
            }
          `}
        >
          <h2
            className={`
              text-xl
              font-bold
              ${
                theme === "dark"
                  ? "text-zinc-100"
                  : "text-zinc-900"
              }
            `}
          >
            Compression Result
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">

            {/* Original */}

            <div
              className={`
                rounded-xl
                border
                p-4
                ${
                  theme === "dark"
                    ? "border-zinc-700 bg-zinc-950"
                    : "border-zinc-200 bg-zinc-50"
                }
              `}
            >
              <p
                className={`
                  text-sm
                  ${
                    theme === "dark"
                      ? "text-zinc-400"
                      : "text-zinc-500"
                  }
                `}
              >
                Original Size
              </p>

              <p
                className={`
                  mt-1
                  text-lg
                  font-bold
                  ${
                    theme === "dark"
                      ? "text-white"
                      : "text-zinc-900"
                  }
                `}
              >
                {formatBytes(
                  result.originalSize
                )}
              </p>
            </div>

            {/* Compressed */}

            <div
              className={`
                rounded-xl
                border
                p-4
                ${
                  theme === "dark"
                    ? "border-zinc-700 bg-zinc-950"
                    : "border-zinc-200 bg-zinc-50"
                }
              `}
            >
              <p
                className={`
                  text-sm
                  ${
                    theme === "dark"
                      ? "text-zinc-400"
                      : "text-zinc-500"
                  }
                `}
              >
                Compressed Size
              </p>

              <p
                className={`
                  mt-1
                  text-lg
                  font-bold
                  ${
                    theme === "dark"
                      ? "text-white"
                      : "text-zinc-900"
                  }
                `}
              >
                {formatBytes(
                  result.compressedSize
                )}
              </p>
            </div>

            {/* Reduction */}

            <div
              className={`
                rounded-xl
                border
                p-4
                ${
                  theme === "dark"
                    ? "border-zinc-700 bg-zinc-950"
                    : "border-zinc-200 bg-zinc-50"
                }
              `}
            >
              <p
                className={`
                  text-sm
                  ${
                    theme === "dark"
                      ? "text-zinc-400"
                      : "text-zinc-500"
                  }
                `}
              >
                Size Reduced
              </p>

              <p
                className={`
                  mt-1
                  text-lg
                  font-bold
                  ${
                    result.reduction > 0
                      ? "text-green-600 dark:text-green-400"
                      : theme === "dark"
                      ? "text-zinc-100"
                      : "text-zinc-900"
                  }
                `}
              >
                {result.reduction.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Download */}

          <div className="mt-5">
            <button
              type="button"
              onClick={handleDownload}
              className={`
                cursor-pointer
                rounded-xl
                px-5
                py-2.5
                text-sm
                font-medium
                shadow-sm
                transition
                ${
                  theme === "dark"
                    ? `
                      bg-white
                      text-black
                      hover:bg-zinc-200
                    `
                    : `
                      bg-black
                      text-white
                      hover:bg-zinc-800
                    `
                }
              `}
            >
              Download Compressed Image
            </button>
          </div>
        </div>
      )}

      {/* Toast */}

      {toast && (
        <div className="fixed right-5 top-5 z-50">
          <div
            className={`
              flex
              min-w-[280px]
              items-center
              gap-3
              rounded-xl
              border
              px-4
              py-3
              shadow-lg
              ${
                toast.type === "success"
                  ? `
                    border-green-200
                    bg-green-50
                    text-green-800
                    dark:border-green-900
                    dark:bg-green-950
                    dark:text-green-300
                  `
                  : toast.type === "error"
                  ? `
                    border-red-200
                    bg-red-50
                    text-red-800
                    dark:border-red-900
                    dark:bg-red-950
                    dark:text-red-300
                  `
                  : `
                    border-blue-200
                    bg-blue-50
                    text-blue-800
                    dark:border-blue-900
                    dark:bg-blue-950
                    dark:text-blue-300
                  `
              }
            `}
          >
            <div
              className={`
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-full
                text-sm
                font-bold
                text-white
                ${
                  toast.type === "success"
                    ? "bg-green-600"
                    : toast.type === "error"
                    ? "bg-red-600"
                    : "bg-blue-600"
                }
              `}
            >
              {toast.type === "success"
                ? "✓"
                : toast.type === "error"
                ? "!"
                : "i"}
            </div>

            <p className="text-sm font-medium">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() =>
                setToast(null)
              }
              className="ml-auto cursor-pointer text-lg opacity-60 hover:opacity-100"
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------- */
/* Helpers */
/* -------------------------------- */

function formatBytes(
  bytes: number
): string {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB",
  ];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  const value =
    bytes /
    Math.pow(1024, index);

  return `${value.toFixed(
    index === 0 ? 0 : 2
  )} ${units[index]}`;
}

function getExtension(
  mimeType: string | null
): string {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";

    case "image/png":
      return "png";

    case "image/webp":
      return "webp";

    case "image/avif":
      return "avif";

    case "image/gif":
      return "gif";

    case "image/svg+xml":
      return "svg";

    default:
      return "webp";
  }
}