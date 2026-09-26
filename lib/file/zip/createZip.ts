import JSZip from "jszip";

/**
 * Extensions jo already compressed hoti hain
 * Inhe DEFLATE se dobara compress karne ka fayda nahi, ulta size badh jata hai
 */
const ALREADY_COMPRESSED_EXTENSIONS = [
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif",
  ".mp4", ".mov", ".avi", ".mkv", ".webm",
  ".mp3", ".aac", ".ogg", ".flac",
  ".zip", ".rar", ".7z", ".gz",
  ".pdf", ".docx", ".xlsx", ".pptx",
];

function isAlreadyCompressed(filename: string): boolean {
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex === -1) return false;
  const ext = filename.slice(dotIndex).toLowerCase();
  return ALREADY_COMPRESSED_EXTENSIONS.includes(ext);
}

/**
 * Multiple files ko ek ZIP blob mein convert karta hai.
 * - Already-compressed files (images/videos/pdf/docx etc.) STORE method se add hoti hain
 *   taaki unka size ZIP banne ke baad na badhe.
 * - Baaki files (txt, csv, json, code, etc.) DEFLATE se compress hoti hain
 *   taaki final ZIP ka size chhota ho.
 */
export async function createZip(files: File[]): Promise<Blob> {
  if (!files || files.length === 0) {
    throw new Error("ZIP banane ke liye kam se kam ek file zaroori hai");
  }

  const zip = new JSZip();

  files.forEach((file) => {
    const compressed = isAlreadyCompressed(file.name);

    zip.file(file.name, file, {
      compression: compressed ? "STORE" : "DEFLATE",
      compressionOptions: compressed ? undefined : { level: 6 },
    });
  });

  try {
    const blob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE", // default fallback, per-file setting override karegi
      compressionOptions: { level: 6 },
    });

    return blob;
  } catch (error) {
    console.error("ZIP generate karte waqt error aaya:", error);
    throw new Error("ZIP file create nahi ho payi. Dobara try karo.");
  }
}

/**
 * ZIP blob ko download trigger karta hai
 */
export function downloadZip(blob: Blob, filename = "files.zip") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}