"use client";

import { useState } from "react";

import JsonEditor from "@/components/tools/csv/JsonEditor";
import JsonFileUpload from "@/components/tools/csv/JsonFileUpload";
import { jsonToCsv } from "@/lib/csv/csv-utils";

const defaultJson = `[
  {
    "name": "Shani",
    "email": "shani@example.com",
    "role": "Developer"
  },
  {
    "name": "Rahul",
    "email": "rahul@example.com",
    "role": "Designer"
  },
  {
    "name": "Amit",
    "email": "amit@example.com",
    "role": "Tester"
  }
]`;

interface Toast {
  type: "success" | "error";
  message: string;
}

export default function JsonToCsvPage() {
  const [json, setJson] = useState(defaultJson);
  const [csv, setCsv] = useState("");

  const [theme, setTheme] =
    useState<"light" | "dark">("light");

  const [toast, setToast] =
    useState<Toast | null>(null);

  // ==========================================
  // TOAST
  // ==========================================

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // ==========================================
  // CONVERT JSON → CSV
  // ==========================================

  const handleConvert = () => {
    if (!json.trim()) {
      setCsv("");

      showToast(
        "There is no JSON data to convert.",
        "error"
      );

      return;
    }

    try {
      const parsed: unknown = JSON.parse(json);

      if (!Array.isArray(parsed)) {
        throw new Error(
          "JSON must contain an array of objects."
        );
      }

      const result = jsonToCsv(parsed);

      setCsv(result);

      showToast(
        "JSON converted to CSV successfully."
      );
    } catch (error) {
      setCsv("");

      if (error instanceof SyntaxError) {
        showToast(
          "Invalid JSON. Please check your JSON syntax.",
          "error"
        );
      } else if (error instanceof Error) {
        showToast(error.message, "error");
      } else {
        showToast(
          "Unable to convert JSON to CSV.",
          "error"
        );
      }
    }
  };

  // ==========================================
  // LOAD EXAMPLE
  // ==========================================

  const handleLoadExample = () => {
    setJson(defaultJson);
    setCsv("");

    showToast("Example JSON loaded.");
  };

  // ==========================================
  // CLEAR
  // ==========================================

  const handleClear = () => {
    setJson("");
    setCsv("");

    showToast("JSON editor cleared.");
  };

  // ==========================================
  // FILE UPLOAD
  // ==========================================

  const handleFileLoad = (
    content: string,
    fileName: string
  ) => {
    setJson(content);
    setCsv("");

    showToast(
      `${fileName} uploaded successfully.`
    );
  };

  // ==========================================
  // COPY CSV
  // ==========================================

  const handleCopy = async () => {
    if (!csv.trim()) {
      showToast(
        "There is no CSV to copy.",
        "error"
      );

      return;
    }

    try {
      await navigator.clipboard.writeText(csv);

      showToast(
        "CSV copied to clipboard."
      );
    } catch {
      showToast(
        "Unable to copy CSV to clipboard.",
        "error"
      );
    }
  };

  // ==========================================
  // DOWNLOAD CSV
  // ==========================================

  const handleDownload = () => {
    if (!csv.trim()) {
      showToast(
        "There is no CSV to download.",
        "error"
      );

      return;
    }

    try {
      const blob = new Blob(
        [csv],
        {
          type: "text/csv;charset=utf-8;",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download = "data.csv";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      showToast(
        "CSV downloaded successfully."
      );
    } catch {
      showToast(
        "Unable to download CSV.",
        "error"
      );
    }
  };

  // ==========================================
  // THEME
  // ==========================================

  const handleThemeToggle = () => {
    setTheme((current) =>
      current === "light"
        ? "dark"
        : "light"
    );

    showToast(
      theme === "light"
        ? "Dark mode enabled."
        : "Light mode enabled."
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
      {/* ======================================
          TOAST
      ====================================== */}

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
                  : `
                    border-red-200
                    bg-red-50
                    text-red-800
                    dark:border-red-900
                    dark:bg-red-950
                    dark:text-red-300
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
                    : "bg-red-600"
                }
              `}
            >
              {toast.type === "success"
                ? "✓"
                : "!"}
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

      {/* ======================================
          MAIN CONTAINER
      ====================================== */}

      <div className="mx-auto max-w-6xl">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            JSON to CSV Converter
          </h1>

          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Convert JSON data into CSV format
            directly in your browser.
          </p>
        </div>

        {/* ======================================
            TOOLBAR
        ====================================== */}

        <div className="mb-4 flex flex-wrap items-center gap-2">

          {/* CONVERT */}

          <button
            type="button"
            onClick={handleConvert}
            className="
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
            Convert to CSV
          </button>

          {/* LOAD EXAMPLE */}

          <button
            type="button"
            onClick={handleLoadExample}
            className="
              cursor-pointer
              rounded-lg
              border
              border-zinc-300
              bg-white
              px-4
              py-2
              text-sm
              font-medium
              transition
              hover:bg-zinc-100
              dark:border-zinc-700
              dark:bg-zinc-900
              dark:hover:bg-zinc-800
            "
          >
            Load Example
          </button>

          {/* UPLOAD JSON */}

          <JsonFileUpload
            onFileLoad={handleFileLoad}
            compact
          />

          {/* CLEAR */}

          <button
            type="button"
            onClick={handleClear}
            className="
              cursor-pointer
              rounded-lg
              border
              border-red-200
              bg-white
              px-4
              py-2
              text-sm
              font-medium
              text-red-600
              transition
              hover:bg-red-50
              dark:border-red-900
              dark:bg-zinc-900
              dark:text-red-400
              dark:hover:bg-red-950/30
            "
          >
            Clear
          </button>

          {/* DARK / LIGHT */}

          <button
            type="button"
            onClick={handleThemeToggle}
            className="
              ml-auto
              cursor-pointer
              rounded-lg
              border
              border-zinc-300
              bg-white
              px-4
              py-2
              text-sm
              font-medium
              transition
              hover:bg-zinc-100
              dark:border-zinc-700
              dark:bg-zinc-900
              dark:hover:bg-zinc-800
            "
          >
            {theme === "light"
              ? "🌙 Dark"
              : "☀️ Light"}
          </button>
        </div>

        {/* ======================================
            JSON INPUT
        ====================================== */}

        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">
            JSON Input
          </h2>

          <JsonEditor
            value={json}
            onChange={(value) => {
              setJson(value);
              setCsv("");
            }}
            theme={theme}
            height="350px"
          />
        </div>

        {/* ======================================
            OUTPUT HEADER
        ====================================== */}

        <div
          className="
            mb-3
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <h2 className="text-lg font-semibold">
            CSV Output
          </h2>

          <div className="flex gap-2">

            {/* COPY */}

            <button
              type="button"
              onClick={handleCopy}
              disabled={!csv.trim()}
              className="
                cursor-pointer
                rounded-lg
                border
                border-zinc-300
                bg-white
                px-4
                py-2
                text-sm
                font-medium
                transition
                hover:bg-zinc-100
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:border-zinc-700
                dark:bg-zinc-900
                dark:hover:bg-zinc-800
              "
            >
              Copy
            </button>

            {/* DOWNLOAD */}

            <button
              type="button"
              onClick={handleDownload}
              disabled={!csv.trim()}
              className="
                cursor-pointer
                rounded-lg
                border
                border-zinc-300
                bg-white
                px-4
                py-2
                text-sm
                font-medium
                transition
                hover:bg-zinc-100
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:border-zinc-700
                dark:bg-zinc-900
                dark:hover:bg-zinc-800
              "
            >
              Download
            </button>
          </div>
        </div>

        {/* ======================================
            CSV OUTPUT
        ====================================== */}

        <JsonEditor
          value={csv}
          onChange={() => {}}
          theme={theme}
          height="350px"
          readOnly
        />

        {/* ======================================
            PRIVACY
        ====================================== */}

        <div className="mt-6 text-sm text-zinc-500">
          Your JSON data is processed locally
          in your browser.
        </div>
      </div>
    </main>
  );
}