"use client";

import { useRef, useState } from "react";

interface Base64EncoderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

interface Toast {
  type: "success" | "error" | "info";
  message: string;
}

export default function Base64Encoder({
  theme,
  onToggleTheme,
}: Base64EncoderProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [toast, setToast] =
    useState<Toast | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  /* -----------------------------
     Encode
  ----------------------------- */

  const handleEncode = () => {
    if (!input.trim()) {
      setOutput("");

      setToast({
        type: "error",
        message: "Please enter text to encode.",
      });

      return;
    }

    try {
      const bytes = new TextEncoder().encode(input);

      let binary = "";

      bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
      });

      const encoded = btoa(binary);

      setOutput(encoded);

      setToast({
        type: "success",
        message: "Text encoded successfully.",
      });
    } catch {
      setOutput("");

      setToast({
        type: "error",
        message: "Unable to encode text.",
      });
    }
  };

  /* -----------------------------
     Upload
  ----------------------------- */

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setToast({
          type: "error",
          message: "Unable to read the file.",
        });

        return;
      }

      setInput(reader.result);
      setOutput("");

      setToast({
        type: "success",
        message: "File uploaded successfully.",
      });
    };

    reader.onerror = () => {
      setToast({
        type: "error",
        message: "Unable to read the file.",
      });
    };

    reader.readAsText(file);
  };

  /* -----------------------------
     Clear
  ----------------------------- */

  const handleClear = () => {
    setInput("");
    setOutput("");
    setToast(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* -----------------------------
     Copy
  ----------------------------- */

  const handleCopy = async () => {
    if (!output) {
      setToast({
        type: "error",
        message: "Nothing to copy.",
      });

      return;
    }

    try {
      await navigator.clipboard.writeText(output);

      setToast({
        type: "success",
        message: "Encoded Base64 copied successfully.",
      });
    } catch {
      setToast({
        type: "error",
        message: "Unable to copy text.",
      });
    }
  };

  /* -----------------------------
     Download
  ----------------------------- */

  const handleDownload = () => {
    if (!output) {
      setToast({
        type: "error",
        message: "Nothing to download.",
      });

      return;
    }

    try {
      const blob = new Blob(
        [output],
        {
          type: "text/plain;charset=utf-8",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download = "encoded-base64.txt";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setToast({
        type: "success",
        message: "Encoded Base64 downloaded successfully.",
      });
    } catch {
      setToast({
        type: "error",
        message: "Unable to download the file.",
      });
    }
  };

  return (
    <div className="w-full">

 {/* =========================
          Action Row
      ========================== */}

      <div className="mt-4 flex items-center gap-3">

        {/* Encode */}

        <button
          type="button"
          onClick={handleEncode}
          className="
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
            dark:bg-white
            dark:text-black
            dark:hover:bg-zinc-200
          "
        >
          Encode Base64
        </button>

        {/* Upload */}

        <label
          className="
            cursor-pointer
            rounded-xl
            border
            border-zinc-300
            bg-white
            px-4
            py-2.5
            text-sm
            font-medium
            text-zinc-900
            transition
            hover:bg-zinc-100
            dark:border-zinc-700
            dark:bg-zinc-900
            dark:text-zinc-100
            dark:hover:bg-zinc-800
          "
        >
          Upload File

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {/* Clear */}

        <button
          type="button"
          onClick={handleClear}
          className="
            cursor-pointer
            rounded-xl
            border
            border-red-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-medium
            text-red-600
            transition
            hover:bg-red-50
            dark:border-red-900
            dark:bg-zinc-900
            dark:text-red-400
            dark:hover:bg-red-950
          "
        >
          Clear
        </button>

        {/* Theme */}

        <button
          type="button"
          onClick={onToggleTheme}
          className="
            ml-auto
            cursor-pointer
            rounded-xl
            border
            border-zinc-300
            bg-white
            px-4
            py-2.5
            text-sm
            font-medium
            text-zinc-900
            shadow-sm
            transition
            hover:bg-zinc-100
            dark:border-zinc-700
            dark:bg-zinc-900
            dark:text-zinc-100
            dark:hover:bg-zinc-800
          "
        >
          {theme === "light"
            ? "🌙 Dark"
            : "☀️ Light"}
        </button>
      </div>

      {/* =========================
          Input Heading
      ========================== */}

      <div className="mb-3">
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
          Text Input
        </h2>
      </div>

      {/* =========================
          Input
      ========================== */}

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
        <textarea
          value={input}
          onChange={(event) =>
            setInput(event.target.value)
          }
          placeholder="Enter text to encode..."
          spellCheck={false}
          className={`
            min-h-[440px]
            w-full
            resize-y
            border-0
            p-4
            font-mono
            text-sm
            leading-6
            outline-none
            ${
              theme === "dark"
                ? `
                  bg-zinc-900
                  text-zinc-100
                  placeholder:text-zinc-600
                `
                : `
                  bg-white
                  text-zinc-900
                  placeholder:text-zinc-400
                `
            }
          `}
        />
      </div>

     
      {/* =========================
          Output Heading
      ========================== */}

      <div className="mt-8 flex items-center justify-between">

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
          Encoded Output
        </h2>

        <div className="flex items-center gap-2">

          {/* Copy */}

          <button
            type="button"
            onClick={handleCopy}
            disabled={!output}
            className="
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
              dark:border-zinc-700
              dark:bg-zinc-900
              dark:text-zinc-100
              dark:hover:bg-zinc-800
            "
          >
            Copy
          </button>

          {/* Download */}

          <button
            type="button"
            onClick={handleDownload}
            disabled={!output}
            className="
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
              dark:border-zinc-700
              dark:bg-zinc-900
              dark:text-zinc-100
              dark:hover:bg-zinc-800
            "
          >
            Download
          </button>

        </div>
      </div>

      {/* =========================
          Output
      ========================== */}

      <div
        className={`
          mt-3
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
        <textarea
          value={output}
          readOnly
          placeholder="Encoded Base64 result will appear here..."
          spellCheck={false}
          className={`
            min-h-[440px]
            w-full
            resize-y
            border-0
            p-4
            font-mono
            text-sm
            leading-6
            outline-none
            ${
              theme === "dark"
                ? `
                  bg-zinc-900
                  text-zinc-100
                  placeholder:text-zinc-600
                `
                : `
                  bg-white
                  text-zinc-900
                  placeholder:text-zinc-400
                `
            }
          `}
        />
      </div>

      {/* =========================
          Toast
      ========================== */}

      {toast && (
        <div
          className="
            fixed
            right-5
            top-5
            z-50
            animate-in
            fade-in
            slide-in-from-top-2
            duration-200
          "
        >
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
              backdrop-blur
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