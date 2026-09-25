"use client";

import Base64Encoder from "@/components/tools/encoding/Base64Encoder";
import { useState } from "react";

export default function Base64EncoderPage() {
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
      <div className={theme === "dark" ? "dark" : ""}>
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
              Base64 Encoder
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
              Encode plain text into Base64 encoded text
              directly in your browser.
            </p>
          </div>

          {/* Tool */}

          <Base64Encoder
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
            Your text is processed locally in your browser.
          </p>
        </div>
      </div>
    </main>
  );
}