"use client";

import Link from "next/link";

interface FooterProps {
  theme: "light" | "dark";
}

export default function Footer({
  theme,
}: FooterProps) {
  const isDark = theme === "dark";

  return (
    <footer
      className={`mt-20 border-t ${
        isDark
          ? "border-zinc-800 bg-zinc-950"
          : "border-zinc-200 bg-zinc-50"
      }`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className={`text-lg font-bold tracking-tight ${
                isDark
                  ? "text-white"
                  : "text-zinc-900"
              }`}
            >
              DevTools Hub
            </Link>

            <p
              className={`mt-3 max-w-md text-sm leading-6 ${
                isDark
                  ? "text-zinc-400"
                  : "text-zinc-600"
              }`}
            >
              Simple, fast and privacy-friendly
              developer tools that work directly
              in your browser.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3
              className={`text-sm font-semibold ${
                isDark
                  ? "text-white"
                  : "text-zinc-900"
              }`}
            >
              Tools
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/json-formatter"
                className={`text-sm transition ${
                  isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                JSON Formatter
              </Link>

              <Link
                href="/jwt-decoder"
                className={`text-sm transition ${
                  isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                JWT Decoder
              </Link>

              <Link
                href="/regex-tester"
                className={`text-sm transition ${
                  isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Regex Tester
              </Link>

              <Link
                href="/uuid-generator"
                className={`text-sm transition ${
                  isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                UUID Generator
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3
              className={`text-sm font-semibold ${
                isDark
                  ? "text-white"
                  : "text-zinc-900"
              }`}
            >
              Categories
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/#categories"
                className={`text-sm transition ${
                  isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                JSON Tools
              </Link>

              <Link
                href="/#categories"
                className={`text-sm transition ${
                  isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Encoding Tools
              </Link>

              <Link
                href="/#categories"
                className={`text-sm transition ${
                  isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Regex Tools
              </Link>

              <Link
                href="/#categories"
                className={`text-sm transition ${
                  isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Generators
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className={`mt-10 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between ${
            isDark
              ? "border-zinc-800"
              : "border-zinc-200"
          }`}
        >
          <p
            className={`text-sm ${
              isDark
                ? "text-zinc-500"
                : "text-zinc-500"
            }`}
          >
            © {new Date().getFullYear()} DevTools Hub.
            All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className={`text-sm transition ${
                isDark
                  ? "text-zinc-500 hover:text-zinc-300"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Privacy
            </Link>

            <Link
              href="/about"
              className={`text-sm transition ${
                isDark
                  ? "text-zinc-500 hover:text-zinc-300"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}