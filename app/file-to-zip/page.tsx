"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FileToZip from "@/components/tools/file/zip/FileToZip";

export default function FileToZipPage() {
  const [theme, setTheme] =
    useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  };

  const isDark = theme === "dark";

  return (
    <main
      className={`
        min-h-screen
        flex
        flex-col
        ${
          isDark
            ? "bg-zinc-950 text-zinc-50"
            : "bg-zinc-50 text-zinc-900"
        }
      `}
    >
      {/* Navbar */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Page Content */}
      <div
        className={`
          flex-1
          ${isDark ? "dark" : ""}
        `}
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1
              className={`
                text-3xl
                font-bold
                tracking-tight
                sm:text-4xl
                ${
                  isDark
                    ? "text-white"
                    : "text-zinc-900"
                }
              `}
            >
              File to ZIP Converter
            </h1>

            <p
              className={`
                mx-auto
                mt-3
                max-w-2xl
                text-sm
                sm:text-base
                ${
                  isDark
                    ? "text-zinc-400"
                    : "text-zinc-600"
                }
              `}
            >
              Upload multiple files and combine them
              into a single ZIP archive directly in
              your browser.
            </p>
          </div>

          {/* Tool */}
          <FileToZip />
        </div>
      </div>

      {/* Footer */}
      <Footer theme={theme} />
    </main>
  );
}