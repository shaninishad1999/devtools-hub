"use client";

import { useState } from "react";
import RegexTester from "@/components/tools/regex/RegexTester";

export default function RegexTesterPage() {
  const [theme, setTheme] =
    useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  };

  return (
    <main
      className={`
        min-h-screen
        px-4
        py-8
        sm:px-6
        lg:px-8
        ${
          theme === "dark"
            ? "bg-zinc-950 text-zinc-50"
            : "bg-zinc-50 text-zinc-900"
        }
      `}
    >
      <div
        className={
          theme === "dark"
            ? "dark"
            : ""
        }
      >
        <div className="mx-auto w-full max-w-6xl">

          {/* Header */}

          <div className="mb-8">
            <h1
              className={`
                text-3xl
                font-bold
                tracking-tight
                ${
                  theme === "dark"
                    ? "text-white"
                    : "text-zinc-900"
                }
              `}
            >
              Regex Tester
            </h1>

            <p
              className={`
                mt-3
                max-w-2xl
                text-sm
                ${
                  theme === "dark"
                    ? "text-zinc-400"
                    : "text-zinc-600"
                }
              `}
            >
              Test and validate regular expressions
              against text directly in your browser.
            </p>
          </div>

          {/* Tool */}

          <RegexTester
            theme={theme}
            onToggleTheme={toggleTheme}
          />

          {/* Privacy */}

          <p
            className={`
              mt-8
              text-sm
              ${
                theme === "dark"
                  ? "text-zinc-400"
                  : "text-zinc-500"
              }
            `}
          >
            Your regex and test data are processed
            locally in your browser.
          </p>

        </div>
      </div>
    </main>
  );
}