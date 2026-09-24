"use client";

import { useRef, useState } from "react";

interface JsonFileUploadProps {
  onFileLoad: (
    content: string,
    fileName: string
  ) => void;
}

export default function JsonFileUpload({
  onFileLoad,
}: JsonFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] =
    useState(false);

  const handleFile = (file: File) => {
    if (
      file.type !== "application/json" &&
      !file.name.toLowerCase().endsWith(".json")
    ) {
      alert("Please upload a valid .json file.");
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("File size must be less than 10 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const content = reader.result;

      if (typeof content !== "string") {
        alert("Unable to read the file.");
        return;
      }

      onFileLoad(content, file.name);
    };

    reader.onerror = () => {
      alert("Unable to read the file.");
    };

    reader.readAsText(file);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }

    event.target.value = "";
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    setIsDragging(false);

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="mb-4">
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleInputChange}
        className="hidden"
      />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => {
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed p-6 text-center transition ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30"
            : "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900"
        }`}
      >
        <div className="text-2xl">
          📄
        </div>

        <p className="mt-2 text-sm font-medium">
          Drop your JSON file here
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          or
        </p>

        <button
          type="button"
          onClick={() =>
            inputRef.current?.click()
          }
          className="mt-3 cursor-pointer rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Choose JSON File
        </button>

        <p className="mt-3 text-xs text-zinc-500">
          .json files only • Maximum 10 MB
        </p>
      </div>
    </div>
  );
}