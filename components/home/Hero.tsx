"use client";

import Link from "next/link";
import { useState } from "react";

interface HeroProps {
  theme: "light" | "dark";
}

export default function Hero({ theme }: HeroProps) {
  const [search, setSearch] = useState("");

  const isDark = theme === "dark";

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-20 pt-20 text-center sm:px-6 sm:pb-24 sm:pt-24 lg:px-8">
      {/* Badge */}

      <div
        className={`
          mb-6
          inline-flex
          items-center
          rounded-full
          border
          px-4
          py-2
          text-sm
          font-medium
          ${
            isDark
              ? "border-zinc-800 bg-zinc-900 text-zinc-300"
              : "border-zinc-200 bg-white text-zinc-600"
          }
        `}
      >
        ⚡ Fast • Simple • Privacy Friendly
      </div>

      {/* Heading */}

      <h1
        className={`
          max-w-4xl
          text-4xl
          font-bold
          tracking-tight
          sm:text-5xl
          lg:text-6xl
          ${isDark ? "text-white" : "text-zinc-950"}
        `}
      >
        Developer Tools Hub
      </h1>

      {/* Description */}

      <p
        className={`
          mt-6
          max-w-2xl
          text-base
          leading-7
          sm:text-lg
          ${isDark ? "text-zinc-400" : "text-zinc-600"}
        `}
      >
        Simple, fast and privacy-friendly developer
        tools that work directly in your browser.
      </p>

      {/* Search */}

      <div className="mt-10 w-full max-w-2xl">
        <div
          className={`
            flex
            items-center
            rounded-2xl
            border
            p-2
            shadow-sm
            ${
              isDark
                ? "border-zinc-700 bg-zinc-900"
                : "border-zinc-300 bg-white"
            }
          `}
        >
          <span
            className={`
              px-3
              text-lg
              ${isDark ? "text-zinc-500" : "text-zinc-400"}
            `}
          >
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search developer tools..."
            className={`
              min-w-0
              flex-1
              bg-transparent
              px-2
              py-3
              text-sm
              outline-none
              ${
                isDark
                  ? "text-white placeholder:text-zinc-500"
                  : "text-zinc-900 placeholder:text-zinc-400"
              }
            `}
          />

          <Link
            href="#tools"
            className={`
              hidden
              rounded-xl
              px-5
              py-3
              text-sm
              font-medium
              sm:block
              ${
                isDark
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
              }
            `}
          >
            Explore
          </Link>
        </div>

        <p
          className={`
            mt-3
            text-left
            text-xs
            ${isDark ? "text-zinc-500" : "text-zinc-500"}
          `}
        >
          Try searching for JSON, JWT, Regex, Base64,
          UUID and more.
        </p>
      </div>

      {/* Mobile Button */}

      <Link
        href="#tools"
        className={`
          mt-5
          rounded-xl
          px-6
          py-3
          text-sm
          font-medium
          sm:hidden
          ${
            isDark
              ? "bg-white text-black hover:bg-zinc-200"
              : "bg-zinc-900 text-white hover:bg-zinc-800"
          }
        `}
      >
        Explore Tools
      </Link>
    </section>
  );
}