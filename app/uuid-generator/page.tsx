"use client";

import { useState } from "react";
import UUIDGenerator from "@/components/tools/generators/UUIDGenerator";

export default function UUIDGeneratorPage() {
  const [theme, setTheme] =
    useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((current) =>
      current === "light"
        ? "dark"
        : "light"
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
              UUID Generator
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
              Generate unique UUIDs directly
              in your browser.
            </p>

          </div>

          {/* Tool */}

          <UUIDGenerator
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
            UUIDs are generated locally
            in your browser. No data is
            uploaded to a server.
          </p>

        </div>
      </div>
    </main>
  );
}