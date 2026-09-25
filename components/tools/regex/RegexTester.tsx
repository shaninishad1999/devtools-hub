"use client";

import { ChangeEvent, useRef, useState } from "react";
import {
    testRegex,
    RegexMatch,
} from "@/lib/regex/regexTester";

interface RegexTesterProps {
    theme: "light" | "dark";
    onToggleTheme: () => void;
}

export default function RegexTester({
    theme,
    onToggleTheme,
}: RegexTesterProps) {
    const [pattern, setPattern] = useState("");
    const [testText, setTestText] = useState("");

    const [matches, setMatches] = useState<RegexMatch[]>([]);
    const [tested, setTested] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [isUploadingRegex, setIsUploadingRegex] =
        useState(false);

    const [isUploadingText, setIsUploadingText] =
        useState(false);

    const regexInputRef = useRef<HTMLInputElement>(null);
    const textInputRef = useRef<HTMLInputElement>(null);

    const isDark = theme === "dark";

    const handleTest = () => {
        setTested(true);
        setError(null);
        setMatches([]);

        if (!pattern.trim()) {
            setError("Please enter a regular expression.");
            return;
        }

        if (!testText) {
            setError("Please enter test text.");
            return;
        }

        const result = testRegex(pattern, testText, {
            global: true,
        });

        if (!result.valid) {
            setError(result.error);
            return;
        }

        setMatches(result.matches);
    };

    const handleClear = () => {
        setPattern("");
        setTestText("");
        setMatches([]);
        setError(null);
        setTested(false);

        if (regexInputRef.current) {
            regexInputRef.current.value = "";
        }

        if (textInputRef.current) {
            textInputRef.current.value = "";
        }
    };

    const readFile = (
        file: File,
        type: "regex" | "text"
    ) => {
        const reader = new FileReader();

        reader.onload = () => {
            const content =
                typeof reader.result === "string"
                    ? reader.result
                    : "";

            if (type === "regex") {
                setPattern(content.trim());
            } else {
                setTestText(content);
            }

            setError(null);
            setTested(false);
            setMatches([]);
        };

        reader.onerror = () => {
            setError(
                type === "regex"
                    ? "Unable to read regex file."
                    : "Unable to read text file."
            );
        };

        reader.readAsText(file);
    };

    const handleRegexUpload = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setIsUploadingRegex(true);

        readFile(file, "regex");

        setTimeout(() => {
            setIsUploadingRegex(false);
        }, 300);
    };

    const handleTextUpload = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setIsUploadingText(true);

        readFile(file, "text");

        setTimeout(() => {
            setIsUploadingText(false);
        }, 300);
    };

    return (
        <div className="w-full">
            {/* Regular Expression */}
            {/* Action Row */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Test Regex */}
                <button
                    type="button"
                    onClick={handleTest}
                    className={`cursor-pointer rounded-xl px-5 py-2.5 text-sm font-medium shadow-sm transition ${isDark
                            ? "bg-white text-black hover:bg-zinc-200"
                            : "bg-zinc-900 text-white hover:bg-zinc-800"
                        }`}
                >
                    Test Regex
                </button>

                {/* Upload Regex */}
                <button
                    type="button"
                    onClick={() => regexInputRef.current?.click()}
                    className={`cursor-pointer rounded-xl border px-5 py-2.5 text-sm font-medium shadow-sm transition ${isDark
                            ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                            : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
                        }`}
                >
                    {isUploadingRegex ? "Uploading..." : "Upload Regex"}
                </button>

                {/* Upload Text */}
                <button
                    type="button"
                    onClick={() => textInputRef.current?.click()}
                    className={`cursor-pointer rounded-xl border px-5 py-2.5 text-sm font-medium shadow-sm transition ${isDark
                            ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                            : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
                        }`}
                >
                    {isUploadingText ? "Uploading..." : "Upload Text"}
                </button>

                {/* Clear */}
                <button
                    type="button"
                    onClick={handleClear}
                    className={`cursor-pointer rounded-xl border px-5 py-2.5 text-sm font-medium shadow-sm transition ${isDark
                            ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                            : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
                        }`}
                >
                    Clear
                </button>

                {/* Push Dark/Light to right */}
                <div className="flex-1" />

                {/* Dark / Light */}
                <button
                    type="button"
                    onClick={onToggleTheme}
                    className={`cursor-pointer rounded-xl border px-5 py-2.5 text-sm font-medium shadow-sm transition ${isDark
                            ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                            : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
                        }`}
                >
                    {isDark ? "☀️ Light" : "🌙 Dark"}
                </button>
            </div>
            <div className="mb-6">
                <label
                    htmlFor="regex-pattern"
                    className={`mb-2 block text-sm font-semibold ${isDark
                            ? "text-zinc-200"
                            : "text-zinc-800"
                        }`}
                >
                    Regular Expression
                </label>

                <input
                    id="regex-pattern"
                    type="text"
                    value={pattern}
                    onChange={(event) => {
                        setPattern(event.target.value);
                        setTested(false);
                        setError(null);
                    }}
                    placeholder="Example: \d+  |  [A-Z]+  |  ^hello$"
                    spellCheck={false}
                    className={`w-full rounded-xl border px-4 py-3 font-mono text-sm outline-none transition ${isDark
                            ? "border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500"
                            : "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500"
                        }`}
                />

                <p
                    className={`mt-2 text-xs ${isDark
                            ? "text-zinc-500"
                            : "text-zinc-500"
                        }`}
                >
                    Example: \d+ &nbsp; | &nbsp; [A-Z]+
                    &nbsp; | &nbsp; ^hello$
                </p>
            </div>

            {/* Test Text */}

            <div className="mb-6">
                <label
                    htmlFor="regex-test-text"
                    className={`mb-2 block text-sm font-semibold ${isDark
                            ? "text-zinc-200"
                            : "text-zinc-800"
                        }`}
                >
                    Test Text
                </label>

                <textarea
                    id="regex-test-text"
                    value={testText}
                    onChange={(event) => {
                        setTestText(event.target.value);
                        setTested(false);
                        setError(null);
                    }}
                    placeholder="Enter the text you want to test your regex against..."
                    rows={7}
                    className={`w-full resize-y rounded-xl border px-4 py-3 font-mono text-sm outline-none transition ${isDark
                            ? "border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500"
                            : "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500"
                        }`}
                />
            </div>

            {/* Hidden File Inputs */}

            <input
                ref={regexInputRef}
                type="file"
                accept=".txt,.regex,text/plain"
                onChange={handleRegexUpload}
                className="hidden"
            />

            <input
                ref={textInputRef}
                type="file"
                accept=".txt,text/plain"
                onChange={handleTextUpload}
                className="hidden"
            />



            {/* Match Result */}

            <div className="mt-8">
                <h2
                    className={`mb-3 text-lg font-semibold ${isDark
                            ? "text-zinc-100"
                            : "text-zinc-900"
                        }`}
                >
                    Match Result
                </h2>

                {!tested ? (
                    <div
                        className={`rounded-xl border p-5 text-sm ${isDark
                                ? "border-zinc-800 bg-zinc-900 text-zinc-400"
                                : "border-zinc-200 bg-white text-zinc-500"
                            }`}
                    >
                        No matches yet.
                    </div>
                ) : error ? (
                    <div
                        className={`rounded-xl border p-5 ${isDark
                                ? "border-red-900/50 bg-red-950/30"
                                : "border-red-200 bg-red-50"
                            }`}
                    >
                        <p
                            className={`text-sm font-semibold ${isDark
                                    ? "text-red-400"
                                    : "text-red-600"
                                }`}
                        >
                            ✕ Invalid Regular Expression
                        </p>

                        <p
                            className={`mt-2 text-sm ${isDark
                                    ? "text-red-300"
                                    : "text-red-700"
                                }`}
                        >
                            {error}
                        </p>
                    </div>
                ) : (
                    <div
                        className={`rounded-xl border p-5 ${isDark
                                ? "border-zinc-800 bg-zinc-900"
                                : "border-zinc-200 bg-white"
                            }`}
                    >
                        {/* Valid */}

                        <p
                            className={`text-sm font-semibold ${isDark
                                    ? "text-green-400"
                                    : "text-green-600"
                                }`}
                        >
                            ✓ Valid Regular Expression
                        </p>

                        {/* Count */}

                        <p
                            className={`mt-4 text-sm ${isDark
                                    ? "text-zinc-300"
                                    : "text-zinc-700"
                                }`}
                        >
                            Matches Found:{" "}
                            <strong>{matches.length}</strong>
                        </p>

                        {/* No matches */}

                        {matches.length === 0 ? (
                            <p
                                className={`mt-4 text-sm ${isDark
                                        ? "text-zinc-500"
                                        : "text-zinc-500"
                                    }`}
                            >
                                No matches found in the test text.
                            </p>
                        ) : (
                            <div className="mt-5 space-y-3">
                                {matches.map((match, index) => (
                                    <div
                                        key={`${match.index}-${index}`}
                                        className={`rounded-lg border p-4 ${isDark
                                                ? "border-zinc-800 bg-zinc-950"
                                                : "border-zinc-200 bg-zinc-50"
                                            }`}
                                    >
                                        <p
                                            className={`text-xs font-semibold uppercase tracking-wide ${isDark
                                                    ? "text-zinc-500"
                                                    : "text-zinc-500"
                                                }`}
                                        >
                                            Match {index + 1}
                                        </p>

                                        <p
                                            className={`mt-2 break-all font-mono text-sm ${isDark
                                                    ? "text-zinc-100"
                                                    : "text-zinc-900"
                                                }`}
                                        >
                                            {match.value}
                                        </p>

                                        <p
                                            className={`mt-2 text-xs ${isDark
                                                    ? "text-zinc-500"
                                                    : "text-zinc-500"
                                                }`}
                                        >
                                            Position: {match.index}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}