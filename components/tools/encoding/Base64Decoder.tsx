"use client";

import { useRef, useState } from "react";
import { decodeBase64 } from "@/lib/encoding/base64";

interface Base64DecoderProps {
  theme: "light" | "dark";
}

interface Toast {
  type: "success" | "error" | "info";
  message: string;
}

export default function Base64Decoder({
  theme,
}: Base64DecoderProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark = theme === "dark";

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

  /* =========================
     DECODE
  ========================== */

  const handleDecode = () => {
    if (!input.trim()) {
      setOutput("");

      showToast(
        "error",
        "Please enter Base64 encoded text."
      );

      return;
    }

    const result = decodeBase64(input);

    if (!result.success) {
      setOutput("");

      showToast(
        "error",
        result.error || "Unable to decode Base64."
      );

      return;
    }

    setOutput(result.result);

    showToast(
      "success",
      "Base64 decoded successfully."
    );
  };

  /* =========================
     CLEAR
  ========================== */

 const handleClear = () => {
  setInput("");
  setOutput("");

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }

  showToast(
    "success",
    "Base64 data cleared successfully."
  );
};

  /* =========================
     UPLOAD
  ========================== */

  const handleUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const content = reader.result;

      if (typeof content !== "string") {
        showToast(
          "error",
          "Unable to read selected file."
        );

        return;
      }

      setInput(content);
      setOutput("");

      showToast(
        "success",
        "Base64 file uploaded successfully."
      );
    };

    reader.onerror = () => {
      showToast(
        "error",
        "Unable to read selected file."
      );
    };

    reader.readAsText(file);
  };

  /* =========================
     COPY
  ========================== */

  const handleCopy = async () => {
    if (!output) {
      showToast(
        "error",
        "Nothing to copy."
      );

      return;
    }

    try {
      await navigator.clipboard.writeText(output);

      showToast(
        "success",
        "Decoded text copied successfully."
      );
    } catch {
      showToast(
        "error",
        "Unable to copy text."
      );
    }
  };

  /* =========================
     DOWNLOAD
  ========================== */

  const handleDownload = () => {
    if (!output) {
      showToast(
        "error",
        "Nothing to download."
      );

      return;
    }

    try {
      const blob = new Blob(
        [output],
        {
          type: "text/plain;charset=utf-8",
        }
      );

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "decoded-base64.txt";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      showToast(
        "success",
        "Decoded file downloaded successfully."
      );
    } catch {
      showToast(
        "error",
        "Unable to download file."
      );
    }
  };

  return (
    <div className="w-full">

      {/* =========================
          ACTION BAR
      ========================== */}

      <div className="mb-7 flex items-center justify-between gap-4">

        {/* Left Actions */}

        <div className="flex items-center gap-2">

          {/* Decode */}

          <button
            type="button"
            onClick={handleDecode}
            className={
              isDark
                ? `
                  cursor-pointer
                  rounded-xl
                  bg-white
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-black
                  transition
                  hover:bg-zinc-200
                `
                : `
                  cursor-pointer
                  rounded-xl
                  bg-black
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-zinc-800
                `
            }
          >
            Decode Base64
          </button>

          {/* Upload */}

          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            className={
              isDark
                ? `
                  cursor-pointer
                  rounded-xl
                  border
                  border-zinc-700
                  bg-zinc-900
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-zinc-100
                  transition
                  hover:bg-zinc-800
                `
                : `
                  cursor-pointer
                  rounded-xl
                  border
                  border-zinc-300
                  bg-white
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-zinc-900
                  transition
                  hover:bg-zinc-100
                `
            }
          >
            Upload File
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.base64"
            onChange={handleUpload}
            className="hidden"
          />

          {/* Clear */}

          <button
            type="button"
            onClick={handleClear}
            className={
              isDark
                ? `
                  cursor-pointer
                  rounded-xl
                  border
                  border-red-900
                  bg-zinc-900
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-red-400
                  transition
                  hover:bg-red-950
                `
                : `
                  cursor-pointer
                  rounded-xl
                  border
                  border-red-200
                  bg-white
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-red-600
                  transition
                  hover:bg-red-50
                `
            }
          >
            Clear
          </button>

        </div>
      </div>

      {/* =========================
          INPUT HEADING
      ========================== */}

      <div className="mb-3">
        <h2 className="text-xl font-bold">
          Base64 Input
        </h2>
      </div>

      {/* =========================
          INPUT
      ========================== */}

      <div
        className={
          isDark
            ? `
              overflow-hidden
              rounded-xl
              border
              border-zinc-700
              bg-zinc-900
              shadow-sm
            `
            : `
              overflow-hidden
              rounded-xl
              border
              border-zinc-300
              bg-white
              shadow-sm
            `
        }
      >
        <textarea
          value={input}
          onChange={(event) =>
            setInput(event.target.value)
          }
          placeholder="Paste Base64 encoded text here..."
          spellCheck={false}
          className={
            isDark
              ? `
                min-h-[440px]
                w-full
                resize-y
                border-0
                bg-zinc-900
                p-4
                font-mono
                text-sm
                leading-6
                text-zinc-100
                outline-none
                placeholder:text-zinc-600
              `
              : `
                min-h-[440px]
                w-full
                resize-y
                border-0
                bg-white
                p-4
                font-mono
                text-sm
                leading-6
                text-zinc-900
                outline-none
                placeholder:text-zinc-400
              `
          }
        />
      </div>

      {/* =========================
          OUTPUT HEADER
      ========================== */}

      <div className="mt-8 flex items-center justify-between">

        <h2 className="text-xl font-bold">
          Decoded Output
        </h2>

        <div className="flex items-center gap-2">

          {/* Copy */}

          <button
            type="button"
            onClick={handleCopy}
            disabled={!output}
            className={
              isDark
                ? `
                  cursor-pointer
                  rounded-xl
                  border
                  border-zinc-700
                  bg-zinc-900
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-zinc-100
                  transition
                  hover:bg-zinc-800
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                `
                : `
                  cursor-pointer
                  rounded-xl
                  border
                  border-zinc-300
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-zinc-900
                  transition
                  hover:bg-zinc-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                `
            }
          >
            Copy
          </button>

          {/* Download */}

          <button
            type="button"
            onClick={handleDownload}
            disabled={!output}
            className={
              isDark
                ? `
                  cursor-pointer
                  rounded-xl
                  border
                  border-zinc-700
                  bg-zinc-900
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-zinc-100
                  transition
                  hover:bg-zinc-800
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                `
                : `
                  cursor-pointer
                  rounded-xl
                  border
                  border-zinc-300
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-zinc-900
                  transition
                  hover:bg-zinc-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                `
            }
          >
            Download
          </button>

        </div>
      </div>

      {/* =========================
          OUTPUT
      ========================== */}

      <div
        className={
          isDark
            ? `
              mt-3
              overflow-hidden
              rounded-xl
              border
              border-zinc-700
              bg-zinc-900
              shadow-sm
            `
            : `
              mt-3
              overflow-hidden
              rounded-xl
              border
              border-zinc-300
              bg-white
              shadow-sm
            `
        }
      >
        <textarea
          value={output}
          readOnly
          placeholder="Decoded result will appear here..."
          spellCheck={false}
          className={
            isDark
              ? `
                min-h-[440px]
                w-full
                resize-y
                border-0
                bg-zinc-900
                p-4
                font-mono
                text-sm
                leading-6
                text-zinc-100
                outline-none
                placeholder:text-zinc-600
              `
              : `
                min-h-[440px]
                w-full
                resize-y
                border-0
                bg-white
                p-4
                font-mono
                text-sm
                leading-6
                text-zinc-900
                outline-none
                placeholder:text-zinc-400
              `
          }
        />
      </div>

      {/* =========================
          TOAST
      ========================== */}

      {toast && (
        <div className="fixed right-5 top-5 z-[100]">
          <div
            className={
              isDark
                ? `
                  flex
                  min-w-[280px]
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-zinc-700
                  bg-zinc-900
                  px-4
                  py-3
                  text-zinc-100
                  shadow-xl
                `
                : `
                  flex
                  min-w-[280px]
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-zinc-200
                  bg-white
                  px-4
                  py-3
                  text-zinc-900
                  shadow-xl
                `
            }
          >

            {/* Toast Icon */}

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

            {/* Message */}

            <p className="text-sm font-medium">
              {toast.message}
            </p>

            {/* Close */}

            <button
              type="button"
              onClick={() => setToast(null)}
              className="
                ml-auto
                cursor-pointer
                text-lg
                leading-none
                opacity-60
                transition
                hover:opacity-100
              "
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