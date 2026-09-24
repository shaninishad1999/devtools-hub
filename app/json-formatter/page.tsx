"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";

import JsonEditor from "@/components/tools/json/JsonEditor";
import JsonValidation from "@/components/tools/json/JsonValidation";

import {
  formatJson,
  minifyJson,
  validateJson,
  repairJson,
} from "@/lib/json/json-utils";

const defaultJson = `{
  "name": "DevTools Hub",
  "type": "Developer Toolkit",
  "free": true
}`;

type ToastType = "success" | "error" | "info";

interface Toast {
  message: string;
  type: ToastType;
}

export default function JsonFormatterPage() {
  const [json, setJson] = useState(defaultJson);

  const [theme, setTheme] =
    useState<"light" | "dark">("light");

  const [validation, setValidation] = useState({
    valid: false,
    error: null as string | null,
    line: null as number | null,
    column: null as number | null,
  });

  const [hasValidated, setHasValidated] =
    useState(false);

  const [toast, setToast] =
    useState<Toast | null>(null);

  // File input reference
  const inputRef =
    useRef<HTMLInputElement>(null);

  // -----------------------------------------
  // TOAST
  // -----------------------------------------

  const showToast = (
    message: string,
    type: ToastType = "success"
  ) => {
    setToast({
      message,
      type,
    });
  };

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [toast]);

  // -----------------------------------------
  // UPLOAD JSON FILE
  // -----------------------------------------

  const handleFileUpload = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // JSON file validation
    if (
      file.type !== "application/json" &&
      !file.name
        .toLowerCase()
        .endsWith(".json")
    ) {
      showToast(
        "Please upload a valid JSON file.",
        "error"
      );

      event.target.value = "";
      return;
    }

    // 10 MB limit
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      showToast(
        "File size must be less than 10 MB.",
        "error"
      );

      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const content = reader.result;

      if (typeof content !== "string") {
        showToast(
          "Unable to read the file.",
          "error"
        );

        return;
      }

      setJson(content);

      setHasValidated(false);

      setValidation({
        valid: false,
        error: null,
        line: null,
        column: null,
      });

      showToast(
        `${file.name} loaded successfully.`,
        "success"
      );
    };

    reader.onerror = () => {
      showToast(
        "Unable to read the file.",
        "error"
      );
    };

    reader.readAsText(file);

    // Same file can be uploaded again
    event.target.value = "";
  };

  // -----------------------------------------
  // FORMAT
  // -----------------------------------------

  const handleFormat = () => {
    if (!json.trim()) {
      showToast(
        "There is no JSON to format.",
        "error"
      );

      return;
    }

    try {
      const formatted = formatJson(json);

      setJson(formatted);

      setHasValidated(false);

      showToast(
        "JSON formatted successfully.",
        "success"
      );
    } catch {
      setHasValidated(false);

      showToast(
        "Unable to format. The JSON contains an error.",
        "error"
      );
    }
  };

  // -----------------------------------------
  // VALIDATE
  // -----------------------------------------

  const handleValidate = () => {
    const result = validateJson(json);

    setValidation(result);

    setHasValidated(true);

    if (result.valid) {
      showToast(
        "JSON is valid.",
        "success"
      );
    } else {
      showToast(
        "JSON contains an error.",
        "error"
      );
    }
  };

  // -----------------------------------------
  // REPAIR
  // -----------------------------------------

  const handleRepair = () => {
    if (!json.trim()) {
      showToast(
        "There is no JSON to repair.",
        "error"
      );

      return;
    }

    try {
      const repaired = repairJson(json);

      setJson(repaired);

      setValidation({
        valid: true,
        error: null,
        line: null,
        column: null,
      });

      setHasValidated(false);

      showToast(
        "JSON repaired successfully.",
        "success"
      );
    } catch {
      setHasValidated(false);

      showToast(
        "Unable to repair this JSON.",
        "error"
      );
    }
  };

  // -----------------------------------------
  // MINIFY
  // -----------------------------------------

  const handleMinify = () => {
    if (!json.trim()) {
      showToast(
        "There is no JSON to minify.",
        "error"
      );

      return;
    }

    try {
      const minified = minifyJson(json);

      setJson(minified);

      setHasValidated(false);

      showToast(
        "JSON minified successfully.",
        "success"
      );
    } catch {
      setHasValidated(false);

      showToast(
        "Unable to minify. The JSON contains an error.",
        "error"
      );
    }
  };

  // -----------------------------------------
  // COPY
  // -----------------------------------------

  const handleCopy = async () => {
    if (!json.trim()) {
      showToast(
        "There is no JSON to copy.",
        "error"
      );

      return;
    }

    try {
      await navigator.clipboard.writeText(json);

      showToast(
        "JSON copied to clipboard.",
        "success"
      );
    } catch {
      showToast(
        "Unable to copy JSON to clipboard.",
        "error"
      );
    }
  };

  // -----------------------------------------
  // DOWNLOAD
  // -----------------------------------------

  const handleDownload = () => {
    if (!json.trim()) {
      showToast(
        "There is no JSON to download.",
        "error"
      );

      return;
    }

    const blob = new Blob(
      [json],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = "data.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    showToast(
      "JSON downloaded successfully.",
      "success"
    );
  };

  // -----------------------------------------
  // CLEAR
  // -----------------------------------------

  const handleClear = () => {
    setJson("");

    setHasValidated(false);

    setValidation({
      valid: false,
      error: null,
      line: null,
      column: null,
    });

    showToast(
      "Editor cleared.",
      "info"
    );
  };

  // -----------------------------------------
  // THEME
  // -----------------------------------------

  const handleThemeToggle = () => {
    setTheme((current) =>
      current === "light"
        ? "dark"
        : "light"
    );
  };

  return (
    <main
      className="
        min-h-screen
        bg-zinc-50
        px-4
        py-8
        text-zinc-900
        dark:bg-zinc-950
        dark:text-zinc-50
        sm:px-6
        lg:px-8
      "
    >
      {/* -----------------------------------
          TOAST
      ----------------------------------- */}

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
            {/* Icon */}

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
              onClick={() =>
                setToast(null)
              }
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

      <div className="mx-auto max-w-6xl">

        {/* -----------------------------------
            HEADER
        ----------------------------------- */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            JSON Formatter
          </h1>

          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Format, validate and minify JSON data
            directly in your browser.
          </p>
        </div>

        {/* -----------------------------------
            TOOLBAR
        ----------------------------------- */}

        <div className="mb-4 flex flex-wrap items-center gap-2">

          {/* Upload File */}

          <button
            type="button"
            onClick={() =>
              inputRef.current?.click()
            }
            className="
              cursor-pointer
              rounded-lg
              bg-black
              px-3
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
            Upload File
          </button>

          {/* Hidden Input */}

          <input
            ref={inputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Format */}

          <button
            type="button"
            onClick={handleFormat}
            className="
              cursor-pointer
              rounded-lg
              border
              border-zinc-300
              px-3
              py-2
              text-sm
              font-medium
              transition
              hover:bg-zinc-100
              dark:border-zinc-700
              dark:hover:bg-zinc-800
            "
          >
            Format
          </button>

          {/* Validate */}

          <button
            type="button"
            onClick={handleValidate}
            className="
              cursor-pointer
              rounded-lg
              border
              border-zinc-300
              px-3
              py-2
              text-sm
              font-medium
              transition
              hover:bg-zinc-100
              dark:border-zinc-700
              dark:hover:bg-zinc-800
            "
          >
            Validate
          </button>

          {/* Repair */}

          <button
            type="button"
            onClick={handleRepair}
            className="
              cursor-pointer
              rounded-lg
              border
              border-zinc-300
              px-3
              py-2
              text-sm
              font-medium
              transition
              hover:bg-zinc-100
              dark:border-zinc-700
              dark:hover:bg-zinc-800
            "
          >
            Repair JSON
          </button>

          {/* Minify */}

          <button
            type="button"
            onClick={handleMinify}
            className="
              cursor-pointer
              rounded-lg
              border
              border-zinc-300
              px-3
              py-2
              text-sm
              font-medium
              transition
              hover:bg-zinc-100
              dark:border-zinc-700
              dark:hover:bg-zinc-800
            "
          >
            Minify
          </button>

          {/* Copy */}

          <button
            type="button"
            onClick={handleCopy}
            className="
              cursor-pointer
              rounded-lg
              border
              border-zinc-300
              px-3
              py-2
              text-sm
              font-medium
              transition
              hover:bg-zinc-100
              dark:border-zinc-700
              dark:hover:bg-zinc-800
            "
          >
            Copy
          </button>

          {/* Download */}

          <button
            type="button"
            onClick={handleDownload}
            className="
              cursor-pointer
              rounded-lg
              border
              border-zinc-300
              px-3
              py-2
              text-sm
              font-medium
              transition
              hover:bg-zinc-100
              dark:border-zinc-700
              dark:hover:bg-zinc-800
            "
          >
            Download
          </button>

          {/* Clear */}

          <button
            type="button"
            onClick={handleClear}
            className="
              cursor-pointer
              rounded-lg
              border
              border-red-200
              px-3
              py-2
              text-sm
              font-medium
              text-red-600
              transition
              hover:bg-red-50
              dark:border-red-900/50
              dark:hover:bg-red-950/30
            "
          >
            Clear
          </button>

        </div>

        {/* -----------------------------------
            EDITOR
        ----------------------------------- */}

        <JsonEditor
          value={json}
          onChange={(value) => {
            setJson(value);

            // Hide old validation
            // when user edits JSON
            setHasValidated(false);
          }}
          theme={theme}
        />

        {/* -----------------------------------
            VALIDATION RESULT
        ----------------------------------- */}

        {hasValidated && (
          <JsonValidation
            valid={validation.valid}
            error={validation.error}
            line={validation.line}
            column={validation.column}
          />
        )}

        {/* -----------------------------------
            PRIVACY
        ----------------------------------- */}

        <div
          className="
            mt-6
            text-sm
            text-zinc-500
            dark:text-zinc-500
          "
        >
          Your JSON is processed locally in your browser.
        </div>

      </div>
    </main>
  );
}