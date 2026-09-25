"use client";

import { useState } from "react";
import Base64Decoder from "@/components/tools/encoding/Base64Decoder";

export default function Base64DecoderPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

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
      {/* Dark class for Tailwind dark: utilities */}
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
              Base64 Decoder
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
              Decode Base64 encoded text into readable UTF-8
              text directly in your browser.
            </p>
          </div>

          {/* Tool */}
          <Base64Decoder
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
            Your Base64 data is processed locally in your browser.
          </p>
        </div>
      </div>
    </main>
  );
}