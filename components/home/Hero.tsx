"use client";

import { tools } from "@/app/data/tools";
import Link from "next/link";
import { useState } from "react";

interface HeroProps {
  theme: "light" | "dark";
}

export default function Hero({ theme }: HeroProps) {
  const [search, setSearch] = useState("");

  const isDark = theme === "dark";

  const query = search.trim().toLowerCase();

  const searchResults = query
    ? tools.filter((tool) => {
        const name = tool.name.toLowerCase();

        const words = name.split(" ");

        const nameMatch =
          name.startsWith(query) ||
          words.some((word) =>
            word.startsWith(query)
          );

        const keywordMatch = tool.keywords?.some(
          (keyword) =>
            keyword.toLowerCase().startsWith(query)
        );

        return nameMatch || keywordMatch;
      })
    : [];

  return (
    <section
      className="
        mx-auto
        flex
        w-full
        max-w-6xl
        flex-col
        items-center
        px-4
        pb-20
        pt-20
        text-center
        sm:px-6
        sm:pb-24
        sm:pt-24
        lg:px-8
      "
    >
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

      <div className="relative mt-10 w-full max-w-2xl">
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
          {/* Search Icon */}

          <span
            className={`
              px-3
              text-lg
              ${isDark ? "text-zinc-500" : "text-zinc-400"}
            `}
          >
            🔍
          </span>

          {/* Input */}

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search developer tools..."
            autoComplete="off"
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

          {/* Explore */}

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

        {/* Search Results */}

        {query && (
          <div
            className={`
              absolute
              left-0
              right-0
              top-full
              z-50
              mt-2
              overflow-hidden
              rounded-2xl
              border
              text-left
              shadow-lg
              ${
                isDark
                  ? "border-zinc-700 bg-zinc-900"
                  : "border-zinc-200 bg-white"
              }
            `}
          >
            {searchResults.length > 0 ? (
              <div className="max-h-80 overflow-y-auto p-2">
                {searchResults.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setSearch("")}
                    className={`
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-3
                      transition
                      ${
                        isDark
                          ? "hover:bg-zinc-800"
                          : "hover:bg-zinc-100"
                      }
                    `}
                  >
                    {/* Tool Icon */}

                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        text-lg
                        ${
                          isDark
                            ? "bg-zinc-800"
                            : "bg-zinc-100"
                        }
                      `}
                    >
                      {tool.icon}
                    </div>

                    {/* Tool Details */}

                    <div className="min-w-0 flex-1">
                      <div
                        className={`
                          text-sm
                          font-semibold
                          ${
                            isDark
                              ? "text-white"
                              : "text-zinc-900"
                          }
                        `}
                      >
                        {tool.name}
                      </div>

                      <div
                        className={`
                          mt-1
                          truncate
                          text-xs
                          ${
                            isDark
                              ? "text-zinc-400"
                              : "text-zinc-500"
                          }
                        `}
                      >
                        {tool.description}
                      </div>

                      <div
                        className={`
                          mt-1
                          text-xs
                          ${
                            isDark
                              ? "text-zinc-500"
                              : "text-zinc-400"
                          }
                        `}
                      >
                        {tool.category}
                      </div>
                    </div>

                    {/* Arrow */}

                    <span
                      className={`
                        shrink-0
                        text-sm
                        ${
                          isDark
                            ? "text-zinc-500"
                            : "text-zinc-400"
                        }
                      `}
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              /* No Results */

              <div
                className={`
                  px-4
                  py-6
                  text-center
                  text-sm
                  ${
                    isDark
                      ? "text-zinc-400"
                      : "text-zinc-500"
                  }
                `}
              >
                No tools found for "{search}"
              </div>
            )}
          </div>
        )}

        {/* Search Hint */}

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