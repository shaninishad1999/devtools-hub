"use client";

import { useState } from "react";

import CsvEditor from "@/components/tools/csv/CsvEditor";
import { csvToJson } from "@/lib/csv/csv-utils";

const defaultCsv = `name,email,role
Shani,shani@example.com,Developer
Rahul,rahul@example.com,Designer
Amit,amit@example.com,Tester`;

interface Toast {
  type: "success" | "error";
  message: string;
}

export default function CsvToJsonPage() {
  const [csv, setCsv] = useState(defaultCsv);
  const [json, setJson] = useState("");

  const [theme, setTheme] =
    useState<"light" | "dark">("light");

  const [toast, setToast] =
    useState<Toast | null>(null);

  const [fileInputKey, setFileInputKey] =
    useState(0);

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
  // CONVERT
  // ==========================================

  const handleConvert = () => {
    if (!csv.trim()) {
      showToast(
        "There is no CSV data to convert.",
        "error"
      );
      return;
    }

    const result = csvToJson(csv);

    if (!result.success) {
      setJson("");

      showToast(
        result.error || "Unable to convert CSV.",
        "error"
      );

      return;
    }

    const formattedJson = JSON.stringify(
      result.data,
      null,
      2
    );

    setJson(formattedJson);

    showToast(
      "CSV converted to JSON successfully."
    );
  };

  // ==========================================
  // LOAD EXAMPLE
  // ==========================================

  const handleLoadExample = () => {
    setCsv(defaultCsv);
    setJson("");

    showToast("Example CSV loaded.");
  };

  // ==========================================
  // COPY JSON
  // ==========================================

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

      showToast("JSON copied to clipboard.");
    } catch {
      showToast(
        "Unable to copy JSON to clipboard.",
        "error"
      );
    }
  };

  // ==========================================
  // DOWNLOAD JSON
  // ==========================================

  const handleDownload = () => {
    if (!json.trim()) {
      showToast(
        "There is no JSON to download.",
        "error"
      );
      return;
    }

    try {
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
        "JSON downloaded successfully."
      );
    } catch {
      showToast(
        "Unable to download JSON.",
        "error"
      );
    }
  };

  // ==========================================



  // ==========================================
  // CLEAR CSV ONLY
  // ==========================================

  const handleClearCsv = () => {
    setCsv("");
    setJson("");

    setFileInputKey(
      (value) => value + 1
    );

    showToast("CSV input cleared.");
  };

  // ==========================================
  // UPLOAD CSV
  // ==========================================

  const handleUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const fileName =
      file.name.toLowerCase();

    const isCsv =
      fileName.endsWith(".csv") ||
      file.type === "text/csv";

    if (!isCsv) {
      showToast(
        "Please upload a valid CSV file.",
        "error"
      );

      setFileInputKey(
        (value) => value + 1
      );

      return;
    }

    const maxSize =
      50 * 1024 * 1024;

    if (file.size > maxSize) {
      showToast(
        "File size must be less than 50 MB.",
        "error"
      );

      setFileInputKey(
        (value) => value + 1
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
        showToast(
          "Unable to read CSV file.",
          "error"
        );

        return;
      }

      setCsv(reader.result);
      setJson("");

      showToast(
        `${file.name} uploaded successfully.`
      );
    };

    reader.onerror = () => {
      showToast(
        "Unable to read CSV file.",
        "error"
      );
    };

    reader.readAsText(file);

    // Same file dobara select karne ke liye
    setFileInputKey(
      (value) => value + 1
    );
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

      <div className="mx-auto max-w-6xl">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            CSV to JSON Converter
          </h1>

          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Convert CSV data into structured
            JSON directly in your browser.
          </p>
        </div>

        {/* ======================================
            TOOLBAR
        ====================================== */}

        <div className="mb-4 flex flex-wrap items-center gap-2">

          {/* Convert */}

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
            Convert to JSON
          </button>

          {/* Load Example */}

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

          {/* Upload */}

          <input
            key={fileInputKey}
            type="file"
            accept=".csv,text/csv"
            onChange={handleUpload}
            className="hidden"
            id="csv-upload"
          />

          <label
            htmlFor="csv-upload"
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
            Upload CSV
          </label>

          {/* Clear CSV - Upload ke right */}

          <button
            type="button"
            onClick={handleClearCsv}
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
              dark:hover:bg-red-950/40
            "
          >
            Clear
          </button>

          {/* Theme */}

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
            CSV INPUT
        ====================================== */}

        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">
            CSV Input
          </h2>

          <CsvEditor
            value={csv}
            onChange={(value) => {
              setCsv(value);
              setJson("");
            }}
            theme={theme}
            language="plaintext"
            height="350px"
          />
        </div>

        {/* ======================================
            OUTPUT HEADER
        ====================================== */}

        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            JSON Output
          </h2>

          <div className="flex gap-2">

            {/* COPY */}

            <button
              type="button"
              onClick={handleCopy}
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
              Copy
            </button>

            {/* CLEAR - COPY KE RIGHT */}

         

            {/* DOWNLOAD */}

            <button
              type="button"
              onClick={handleDownload}
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
              Download
            </button>

          </div>
        </div>

        {/* ======================================
            JSON OUTPUT EDITOR
        ====================================== */}

        <CsvEditor
          value={json}
          onChange={setJson}
          theme={theme}
          language="json"
          height="400px"
          readOnly
        />

        {/* ======================================
            PRIVACY
        ====================================== */}

        <div className="mt-6 text-sm text-zinc-500">
          Your CSV data is processed locally
          in your browser.
        </div>

      </div>
    </main>
  );
}