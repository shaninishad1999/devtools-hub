"use client";

import { useState } from "react";

import JsonEditor from "@/components/tools/csv/JsonEditor";
import JsonFileUpload from "@/components/tools/csv/JsonFileUpload";
import { jsonToCsv } from "@/lib/csv/csv-utils";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

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

  const isDark = theme === "dark";

  const [toast, setToast] =
    useState<Toast | null>(null);

  // ==========================================
  // THEME
  // ==========================================

  const handleThemeToggle = () => {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  };

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
  // THEME-CONDITIONAL CLASS HELPERS
  // (theme is local state, not the html `dark`
  // class, so Tailwind's `dark:` variant never
  // fires here — every color must be chosen
  // explicitly from `isDark`.)
  // ==========================================

  const primaryButtonClass = `
    cursor-pointer
    rounded-lg
    px-4
    py-2
    text-sm
    font-medium
    transition-all
    duration-200
    hover:-translate-y-0.5
    active:translate-y-0
    ${
      isDark
        ? "bg-white text-black hover:bg-zinc-200 hover:shadow-md hover:shadow-black/30"
        : "bg-black text-white hover:bg-zinc-800 hover:shadow-md"
    }
  `;

  const secondaryButtonClass = `
    cursor-pointer
    rounded-lg
    border
    px-4
    py-2
    text-sm
    font-medium
    transition-all
    duration-200
    hover:-translate-y-0.5
    active:translate-y-0
    disabled:cursor-not-allowed
    disabled:opacity-50
    ${
      isDark
        ? "border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 hover:shadow-sm hover:shadow-black/30"
        : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 hover:shadow-sm"
    }
  `;

  const dangerButtonClass = `
    cursor-pointer
    rounded-lg
    border
    px-4
    py-2
    text-sm
    font-medium
    transition-all
    duration-200
    hover:-translate-y-0.5
    active:translate-y-0
    ${
      isDark
        ? "border-red-900/60 bg-zinc-900 text-red-400 hover:bg-red-950/30"
        : "border-red-200 bg-white text-red-600 hover:bg-red-50 hover:shadow-sm"
    }
  `;

  return (
    <main
      className={`
        min-h-screen
        flex
        flex-col
        ${
          isDark
            ? "bg-zinc-950 text-white"
            : "bg-zinc-50 text-zinc-900"
        }
      `}
    >
      {/* ======================================
          NAVBAR
      ====================================== */}

      <Navbar
        theme={theme}
        onToggleTheme={handleThemeToggle}
      />

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
              ${
                toast.type === "success"
                  ? isDark
                    ? "border-green-900 bg-green-950 text-green-300"
                    : "border-green-200 bg-green-50 text-green-800"
                  : isDark
                    ? "border-red-900 bg-red-950 text-red-300"
                    : "border-red-200 bg-red-50 text-red-800"
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
                text-current
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
          MAIN
      ====================================== */}

      <div className="mx-auto w-full max-w-6xl">

        {/* ======================================
            PAGE TITLE
        ====================================== */}

        <div className="mb-8 px-4 pt-8 sm:px-6 lg:px-8">
          <h1
            className={`
              text-3xl
              font-bold
              tracking-tight
              ${isDark ? "text-white" : "text-zinc-900"}
            `}
          >
            JSON to CSV Converter
          </h1>

          <p
            className={`
              mt-2
              text-sm
              ${isDark ? "text-zinc-300" : "text-zinc-600"}
            `}
          >
            Convert JSON data into CSV format
            directly in your browser.
          </p>
        </div>

        {/* ======================================
            TOOLBAR
        ====================================== */}

        <div
          className="
            mb-4
            flex
            flex-wrap
            items-center
            gap-2
            px-4
            sm:px-6
            lg:px-8
          "
        >
          {/* Convert */}

          <button
            type="button"
            onClick={handleConvert}
            className={primaryButtonClass}
          >
            Convert to CSV
          </button>

          {/* Load Example */}

          <button
            type="button"
            onClick={handleLoadExample}
            className={secondaryButtonClass}
          >
            Load Example
          </button>

          {/* Upload File */}

          <JsonFileUpload
            onFileLoad={handleFileLoad}
            theme={theme}
            compact
          />

          {/* Clear */}

          <button
            type="button"
            onClick={handleClear}
            className={dangerButtonClass}
          >
            Clear
          </button>
        </div>

        {/* ======================================
            JSON INPUT
        ====================================== */}

        <div
          className="
            w-full
            px-4
            py-8
            sm:px-6
            lg:px-8
          "
        >
          <div className="mb-8">

            <h2
              className={`
                mb-3
                text-lg
                font-semibold
                ${isDark ? "text-white" : "text-zinc-900"}
              `}
            >
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
        </div>

        {/* ======================================
            CSV OUTPUT HEADER
        ====================================== */}

        <div
          className="
            mb-3
            flex
            items-center
            justify-between
            gap-3
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <h2
            className={`
              text-lg
              font-semibold
              ${isDark ? "text-white" : "text-zinc-900"}
            `}
          >
            CSV Output
          </h2>

          <div className="flex gap-2">

            {/* Copy */}

            <button
              type="button"
              onClick={handleCopy}
              disabled={!csv.trim()}
              className={secondaryButtonClass}
            >
              Copy
            </button>

            {/* Download */}

            <button
              type="button"
              onClick={handleDownload}
              disabled={!csv.trim()}
              className={secondaryButtonClass}
            >
              Download
            </button>

          </div>
        </div>

        {/* ======================================
            CSV OUTPUT
        ====================================== */}

        <div className="px-4 sm:px-6 lg:px-8">
          <JsonEditor
            value={csv}
            onChange={() => {}}
            theme={theme}
            height="350px"
            readOnly
          />
        </div>

        {/* ======================================
            PRIVACY
        ====================================== */}

        <div
          className={`
            mt-6
            px-4
            pb-8
            text-sm
            ${isDark ? "text-zinc-300" : "text-zinc-500"}
            sm:px-6
            lg:px-8
          `}
        >
          Your JSON data is processed locally
          in your browser.
        </div>
      </div>

      {/* ======================================
          FOOTER
      ====================================== */}

      <Footer theme={theme} />
    </main>
  );
}