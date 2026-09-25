"use client";

import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  testRegex,
  RegexTestResult,
} from "@/lib/regex/regexTester";

interface RegexTesterProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

type ToastType =
  | "success"
  | "error"
  | "info";

interface Toast {
  message: string;
  type: ToastType;
}

export default function RegexTester({
  theme,
  onToggleTheme,
}: RegexTesterProps) {
  const [regex, setRegex] = useState("");
  const [text, setText] = useState("");

  const [result, setResult] =
    useState<RegexTestResult | null>(null);

  const [isUploadingRegex, setIsUploadingRegex] =
    useState(false);

  const [isUploadingText, setIsUploadingText] =
    useState(false);

  const [toast, setToast] =
    useState<Toast | null>(null);

  const regexInputRef =
    useRef<HTMLInputElement>(null);

  const textInputRef =
    useRef<HTMLInputElement>(null);

  const toastTimerRef =
    useRef<number | null>(null);

  const isDark = theme === "dark";

  /* ---------------------------------- */
  /* Toast */
  /* ---------------------------------- */

  const showToast = (
    message: string,
    type: ToastType = "success"
  ) => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(
        toastTimerRef.current
      );
    }

    setToast({
      message,
      type,
    });

    toastTimerRef.current =
      window.setTimeout(() => {
        setToast(null);
        toastTimerRef.current = null;
      }, 3500);
  };

  const closeToast = () => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(
        toastTimerRef.current
      );

      toastTimerRef.current = null;
    }

    setToast(null);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(
          toastTimerRef.current
        );
      }
    };
  }, []);

  /* ---------------------------------- */
  /* Test Regex */
  /* ---------------------------------- */

  const handleTest = () => {
    if (!regex.trim()) {
      setResult(null);

      showToast(
        "Please enter a regular expression.",
        "error"
      );

      return;
    }

    if (!text.trim()) {
      setResult(null);

      showToast(
        "Please enter some test text.",
        "error"
      );

      return;
    }

    const testResult = testRegex(
      regex,
      text,
      {
        global: true,
      }
    );

    setResult(testResult);

    if (!testResult.valid) {
      showToast(
        testResult.error ||
          "Invalid regular expression.",
        "error"
      );

      return;
    }

    if (
      testResult.matches.length === 0
    ) {
      showToast(
        "Regex is valid, but no matches were found.",
        "info"
      );

      return;
    }

    showToast(
      `${testResult.matches.length} match${
        testResult.matches.length === 1
          ? ""
          : "es"
      } found.`,
      "success"
    );
  };

  /* ---------------------------------- */
  /* Clear */
  /* ---------------------------------- */

  const handleClear = () => {
    setRegex("");
    setText("");
    setResult(null);

    if (regexInputRef.current) {
      regexInputRef.current.value = "";
    }

    if (textInputRef.current) {
      textInputRef.current.value = "";
    }

    showToast(
      "Regex tester cleared.",
      "success"
    );
  };

  /* ---------------------------------- */
  /* Upload Regex */
  /* ---------------------------------- */

  const handleRegexUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploadingRegex(true);

    try {
      const content =
        await file.text();

      const trimmedContent =
        content.trim();

      if (!trimmedContent) {
        showToast(
          "The uploaded regex file is empty.",
          "error"
        );

        return;
      }

      setRegex(trimmedContent);

      showToast(
        "Regex file uploaded successfully.",
        "success"
      );
    } catch {
      showToast(
        "Unable to read regex file.",
        "error"
      );
    } finally {
      setIsUploadingRegex(false);

      event.target.value = "";
    }
  };

  /* ---------------------------------- */
  /* Upload Text */
  /* ---------------------------------- */

  const handleTextUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploadingText(true);

    try {
      const content =
        await file.text();

      if (!content) {
        showToast(
          "The uploaded text file is empty.",
          "error"
        );

        return;
      }

      setText(content);

      showToast(
        "Text file uploaded successfully.",
        "success"
      );
    } catch {
      showToast(
        "Unable to read text file.",
        "error"
      );
    } finally {
      setIsUploadingText(false);

      event.target.value = "";
    }
  };

  /* ---------------------------------- */
  /* Get Match Text */
  /* ---------------------------------- */

  const getMatchText = () => {
    if (
      !result ||
      !result.valid ||
      result.matches.length === 0
    ) {
      return "";
    }

    return result.matches
      .map(
        (match, index) =>
          `Match ${index + 1}: ${match.value}\nPosition: ${match.index}`
      )
      .join("\n\n");
  };

  /* ---------------------------------- */
  /* Copy Matches */
  /* ---------------------------------- */

  const handleCopyMatches = async () => {
    const matchText =
      getMatchText();

    if (!matchText) {
      showToast(
        "There are no matches to copy.",
        "error"
      );

      return;
    }

    try {
      await navigator.clipboard.writeText(
        matchText
      );

      showToast(
        "Matches copied to clipboard.",
        "success"
      );
    } catch {
      showToast(
        "Unable to copy matches.",
        "error"
      );
    }
  };

  /* ---------------------------------- */
  /* Download Matches */
  /* ---------------------------------- */

  const handleDownloadMatches = () => {
    const matchText =
      getMatchText();

    if (!matchText) {
      showToast(
        "There are no matches to download.",
        "error"
      );

      return;
    }

    const content = [
      "Regex Tester",
      "==============",
      "",
      `Regex: ${regex}`,
      "",
      "Matches",
      "-------",
      "",
      matchText,
      "",
    ].join("\n");

    try {
      const blob = new Blob(
        [content],
        {
          type:
            "text/plain;charset=utf-8",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        "regex-matches.txt";

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);

      showToast(
        "Matches downloaded successfully.",
        "success"
      );
    } catch {
      showToast(
        "Unable to download matches.",
        "error"
      );
    }
  };

  /* ---------------------------------- */
  /* Toast Classes */
  /* ---------------------------------- */

  const toastContainerClass =
    toast?.type === "success"
      ? isDark
        ? "border-green-900 bg-green-950 text-green-300"
        : "border-green-200 bg-green-50 text-green-800"
      : toast?.type === "error"
      ? isDark
        ? "border-red-900 bg-red-950 text-red-300"
        : "border-red-200 bg-red-50 text-red-800"
      : isDark
      ? "border-blue-900 bg-blue-950 text-blue-300"
      : "border-blue-200 bg-blue-50 text-blue-800";

  const toastIconClass =
    toast?.type === "success"
      ? "bg-green-600"
      : toast?.type === "error"
      ? "bg-red-600"
      : "bg-blue-600";

  /* ---------------------------------- */
  /* Render */
  /* ---------------------------------- */

  return (
    <div className="relative w-full">

      {/* Action Row */}

      <div className="flex flex-wrap items-center gap-3">

        {/* Test Regex */}

        <button
          type="button"
          onClick={handleTest}
          className={`cursor-pointer rounded-xl px-5 py-2.5 text-sm font-medium shadow-sm transition ${
            isDark
              ? "bg-white text-black hover:bg-zinc-200"
              : "bg-zinc-900 text-white hover:bg-zinc-800"
          }`}
        >
          Test Regex
        </button>

        {/* Upload Regex */}

        <button
          type="button"
          onClick={() =>
            regexInputRef.current?.click()
          }
          disabled={isUploadingRegex}
          className={`cursor-pointer rounded-xl border px-5 py-2.5 text-sm font-medium shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
            isDark
              ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
              : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
          }`}
        >
          {isUploadingRegex
            ? "Uploading..."
            : "Upload Regex"}
        </button>

        {/* Upload Text */}

        <button
          type="button"
          onClick={() =>
            textInputRef.current?.click()
          }
          disabled={isUploadingText}
          className={`cursor-pointer rounded-xl border px-5 py-2.5 text-sm font-medium shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
            isDark
              ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
              : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
          }`}
        >
          {isUploadingText
            ? "Uploading..."
            : "Upload Text"}
        </button>

        {/* Clear */}

        <button
          type="button"
          onClick={handleClear}
          className={`cursor-pointer rounded-xl border px-5 py-2.5 text-sm font-medium shadow-sm transition ${
            isDark
              ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
              : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
          }`}
        >
          Clear
        </button>

       
      </div>

      {/* Standard Toast */}

      {toast && (
        <div
          className="fixed right-5 top-5 z-[100] max-w-[calc(100vw-2rem)]"
          role="status"
          aria-live="polite"
        >
          <div
            className={`flex min-w-[280px] max-w-md items-center gap-3 rounded-2xl border px-5 py-4 text-sm font-medium shadow-lg transition-all ${toastContainerClass}`}
          >
            {/* Filled Icon */}

            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold text-white ${toastIconClass}`}
            >
              {toast.type === "success"
                ? "✓"
                : toast.type === "error"
                ? "!"
                : "i"}
            </div>

            {/* Message */}

            <p className="min-w-0 flex-1 leading-5">
              {toast.message}
            </p>

            {/* Close */}

            <button
              type="button"
              onClick={closeToast}
              aria-label="Close notification"
              className="cursor-pointer shrink-0 text-lg leading-none opacity-60 transition hover:opacity-100"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Regular Expression */}

      <div className="mb-6 mt-8">

        <label
          className={`mb-2 block text-sm font-semibold ${
            isDark
              ? "text-zinc-200"
              : "text-zinc-800"
          }`}
        >
          Regular Expression
        </label>

        <input
          type="text"
          value={regex}
          onChange={(event) =>
            setRegex(event.target.value)
          }
          placeholder={
            "Example: \\d+ | [A-Z]+ | ^hello$"
          }
          className={`w-full rounded-xl border px-4 py-3 font-mono text-sm outline-none transition ${
            isDark
              ? "border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500"
              : "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500"
          }`}
        />
      </div>

      {/* Test Text */}

      <div className="mb-6">

        <label
          className={`mb-2 block text-sm font-semibold ${
            isDark
              ? "text-zinc-200"
              : "text-zinc-800"
          }`}
        >
          Test Text
        </label>

        <textarea
          value={text}
          onChange={(event) =>
            setText(event.target.value)
          }
          placeholder="Enter text to test your regular expression..."
          rows={8}
          className={`w-full resize-y rounded-xl border px-4 py-3 font-mono text-sm outline-none transition ${
            isDark
              ? "border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500"
              : "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500"
          }`}
        />
      </div>

      {/* Hidden Regex File Input */}

      <input
        ref={regexInputRef}
        type="file"
        accept=".txt,.regex,.regexp"
        className="hidden"
        onChange={handleRegexUpload}
      />

      {/* Hidden Text File Input */}

      <input
        ref={textInputRef}
        type="file"
        accept=".txt,.csv,.log,.md"
        className="hidden"
        onChange={handleTextUpload}
      />

      {/* Match Result */}

      <div className="mt-8">

        {/* Result Header */}

        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">

          <h2
            className={`text-lg font-semibold ${
              isDark
                ? "text-white"
                : "text-zinc-900"
            }`}
          >
            Match Result
          </h2>

          {/* Result Actions */}

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={handleCopyMatches}
              className={`cursor-pointer rounded-lg border px-3 py-2 text-xs font-medium shadow-sm transition ${
                isDark
                  ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                  : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              Copy All
            </button>

            <button
              type="button"
              onClick={handleDownloadMatches}
              className={`cursor-pointer rounded-lg border px-3 py-2 text-xs font-medium shadow-sm transition ${
                isDark
                  ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                  : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              Download
            </button>

          </div>
        </div>

        {/* Result Box */}

        <div
          className={`rounded-xl border p-5 ${
            isDark
              ? "border-zinc-800 bg-zinc-900"
              : "border-zinc-200 bg-white"
          }`}
        >

          {/* No Result */}

          {!result && (
            <p
              className={`text-sm ${
                isDark
                  ? "text-zinc-500"
                  : "text-zinc-500"
              }`}
            >
              No matches yet.
            </p>
          )}

          {/* Invalid Regex */}

          {result &&
            !result.valid && (
              <div>

                <p className="font-medium text-red-500">
                  ✕ Invalid Regular Expression
                </p>

                <p
                  className={`mt-2 text-sm ${
                    isDark
                      ? "text-zinc-400"
                      : "text-zinc-600"
                  }`}
                >
                  {result.error}
                </p>

              </div>
            )}

          {/* Valid Regex - No Matches */}

          {result &&
            result.valid &&
            result.matches.length === 0 && (
              <div>

                <p className="font-medium text-blue-500">
                  ✓ Valid Regular Expression
                </p>

                <p
                  className={`mt-2 text-sm ${
                    isDark
                      ? "text-zinc-400"
                      : "text-zinc-600"
                  }`}
                >
                  No matches found.
                </p>

              </div>
            )}

          {/* Valid Regex - Matches */}

          {result &&
            result.valid &&
            result.matches.length > 0 && (
              <div>

                <div className="mb-5">

                  <p className="font-medium text-emerald-500">
                    ✓ Valid Regular Expression
                  </p>

                  <p
                    className={`mt-2 text-sm ${
                      isDark
                        ? "text-zinc-400"
                        : "text-zinc-600"
                    }`}
                  >
                    Matches Found:{" "}
                    <strong>
                      {result.matches.length}
                    </strong>
                  </p>

                </div>

                {/* Matches */}

                <div className="space-y-3">

                  {result.matches.map(
                    (match, index) => (
                      <div
                        key={`${match.index}-${index}`}
                        className={`rounded-lg border p-4 ${
                          isDark
                            ? "border-zinc-800 bg-zinc-950"
                            : "border-zinc-200 bg-zinc-50"
                        }`}
                      >

                        <p
                          className={`mb-2 text-sm font-semibold ${
                            isDark
                              ? "text-zinc-200"
                              : "text-zinc-800"
                          }`}
                        >
                          Match {index + 1}
                        </p>

                        <code
                          className={`block break-all rounded-md px-3 py-2 font-mono text-sm ${
                            isDark
                              ? "bg-zinc-900 text-emerald-300"
                              : "bg-white text-emerald-700"
                          }`}
                        >
                          {match.value}
                        </code>

                        <p
                          className={`mt-2 text-xs ${
                            isDark
                              ? "text-zinc-500"
                              : "text-zinc-500"
                          }`}
                        >
                          Position:{" "}
                          {match.index}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

        </div>
      </div>
    </div>
  );
}
