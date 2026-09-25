"use client";

import { useState } from "react";
import ImageCompressor from "@/components/tools/image/ImageCompressor";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ImageCompressorPage() {
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
      className={`min-h-screen flex flex-col ${
        theme === "dark"
          ? "bg-zinc-950 text-zinc-50"
          : "bg-zinc-50 text-zinc-900"
      }`}
    >
      {/* Navbar */}

      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div
        className={
          theme === "dark"
            ? "dark"
            : ""
        }
      >
        {/* <div className="mx-auto w-full max-w-6xl"> */}
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        

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
              Image Compressor
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
              Compress JPG, PNG, WebP, GIF,
              SVG, AVIF and other browser-supported
              images directly in your browser.
            </p>
          </div>

          {/* Tool */}

          <ImageCompressor
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
            Your images are processed locally in
            your browser and are not uploaded to
            a server.
          </p>
        </div>
      </div>

       <Footer theme={theme} />
    </main>
  );
}