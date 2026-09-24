"use client";

import {
  useRef,
  useState,
} from "react";

interface CsvFileUploadProps {
  onFileLoad: (
    content: string,
    fileName: string
  ) => void;
}

export default function CsvFileUpload({
  onFileLoad,
}: CsvFileUploadProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] =
    useState(false);

  const handleFile = (
    file: File
  ) => {
    const fileName =
      file.name.toLowerCase();

    const isCsv =
      file.type === "text/csv" ||
      fileName.endsWith(".csv");

    if (!isCsv) {
      alert(
        "Please upload a valid CSV file."
      );
      return;
    }

    const maxSize =
      50 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        "File size must be less than 50 MB."
      );
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      if (
        typeof reader.result !==
        "string"
      ) {
        alert(
          "Unable to read the file."
        );
        return;
      }

      onFileLoad(
        reader.result,
        file.name
      );
    };

    reader.onerror = () => {
      alert(
        "Unable to read the file."
      );
    };

    reader.readAsText(file);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

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
        accept=".csv,text/csv"
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
        className={`
          rounded-xl
          border-2
          border-dashed
          p-5
          text-center
          transition
          ${
            isDragging
              ? `
                border-blue-500
                bg-blue-50
                dark:border-blue-400
                dark:bg-blue-950/30
              `
              : `
                border-zinc-300
                bg-white
                dark:border-zinc-700
                dark:bg-zinc-900
              `
          }
        `}
      >

        <div className="text-2xl">
          📄
        </div>

        <p
          className="
            mt-2
            text-sm
            font-medium
            text-zinc-900
            dark:text-zinc-100
          "
        >
          Drop your CSV file here
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          or
        </p>

        <button
          type="button"
          onClick={() =>
            inputRef.current?.click()
          }
          className="
            mt-3
            cursor-pointer
            rounded-lg
            bg-black
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-zinc-800
            dark:bg-white
            dark:text-black
            dark:hover:bg-zinc-200
          "
        >
          Choose CSV File
        </button>

        <p className="mt-3 text-xs text-zinc-500">
          .csv files only • Maximum 50 MB
        </p>

      </div>
    </div>
  );
}