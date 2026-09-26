"use client";

import { useState } from "react";
import FileDropzone from "./FileDropzone";
import FileList from "./FileList";
import {
  createZip,
  downloadZip,
} from "@/lib/file/zip/createZip";

function formatTotalSize(files: File[]) {
  const bytes = files.reduce(
    (sum, file) => sum + file.size,
    0
  );

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function FileToZip() {
  const [files, setFiles] = useState<File[]>([]);
  const [isZipping, setIsZipping] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const handleFilesAdded = (
    newFiles: File[]
  ) => {
    setError(null);

    setFiles((previousFiles) => [
      ...previousFiles,
      ...newFiles,
    ]);
  };

  const handleRemove = (index: number) => {
    setFiles((previousFiles) =>
      previousFiles.filter(
        (_, fileIndex) =>
          fileIndex !== index
      )
    );
  };

  const handleClearAll = () => {
    setFiles([]);
    setError(null);
  };

  const handleCreateZip = async () => {
    if (files.length === 0) {
      return;
    }

    setError(null);
    setIsZipping(true);

    try {
      const blob = await createZip(files);

      downloadZip(blob, "files.zip");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsZipping(false);
    }
  };

  return (
   
  <div className="mx-auto w-full max-w-4xl">
    <FileDropzone onFilesAdded={handleFilesAdded} />

    {files.length === 0 ? (
      <div
        className="
          mt-4
          rounded-xl
          border
          border-dashed
          border-zinc-300
          bg-zinc-50
          px-6
          py-8
          text-center
          dark:border-zinc-700
          dark:bg-zinc-900
        "
      >
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No files selected yet
        </p>

        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
          Add images, PDFs, videos, or other files to create a ZIP archive.
        </p>
      </div>
    ) : (
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_240px]">
        {/* Selected Files */}
        <div
          className="
            min-w-0
            rounded-xl
            border
            border-zinc-200
            bg-white
            p-4
            shadow-sm
            dark:border-zinc-800
            dark:bg-zinc-900
          "
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Selected Files
              </h3>

              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {files.length} file{files.length !== 1 ? "s" : ""} ·{" "}
                {formatTotalSize(files)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClearAll}
              className="
              cursor-pointer
                shrink-0
                rounded-lg
                px-3
                py-2
                text-xs
                font-medium
                text-zinc-500
                transition
                hover:bg-red-50
                hover:text-red-600
                dark:text-zinc-400
                dark:hover:bg-red-950/30
                dark:hover:text-red-400
              "
            >
              Clear all
            </button>
          </div>

          <div className="mt-4">
            <FileList
              files={files}
              onRemove={handleRemove}
            />
          </div>
        </div>

        {/* ZIP Action */}
        <div
          className="
            h-fit
            rounded-xl
            border
            border-zinc-200
            bg-white
            p-4
            shadow-sm
            dark:border-zinc-800
            dark:bg-zinc-900
          "
        >
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white cursor-pointer">
            Create ZIP
          </h3>

          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Combine all selected files into a single ZIP archive.
          </p>

          <button
            type="button"
            onClick={handleCreateZip}
            disabled={files.length === 0 || isZipping}
            className="
              mt-4
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-zinc-900
              px-4
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:bg-zinc-800
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:bg-white
              dark:text-zinc-900
              dark:hover:bg-zinc-200
              cursor-pointer
            "
          >
            {isZipping ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />

                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>

                Creating ZIP...
              </>
            ) : (
              <>
                <span>📦</span>
                Create ZIP
              </>
            )}
          </button>
        </div>
      </div>
    )}

    {error && (
      <div
        className="
          mt-4
          rounded-xl
          border
          border-red-200
          bg-red-50
          px-4
          py-3
          text-sm
          text-red-600
          dark:border-red-900/50
          dark:bg-red-950/20
          dark:text-red-400
        "
      >
        {error}
      </div>
    )}
  </div>
);
  
}