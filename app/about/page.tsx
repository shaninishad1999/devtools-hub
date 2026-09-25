"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
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

      {/* About Hero */}

      <section
        className={`
          border-b
          ${
            isDark
              ? "border-zinc-800"
              : "border-zinc-200"
          }
        `}
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p
              className={`
                text-sm
                font-medium
                ${
                  isDark
                    ? "text-zinc-400"
                    : "text-zinc-500"
                }
              `}
            >
              About DevTools Hub
            </p>

            <h1
              className={`
                mt-3
                text-4xl
                font-bold
                tracking-tight
                sm:text-5xl
                ${
                  isDark
                    ? "text-white"
                    : "text-zinc-900"
                }
              `}
            >
              Simple developer tools,
              <br />
              right in your browser.
            </h1>

            <p
              className={`
                mt-6
                max-w-2xl
                text-base
                leading-7
                ${
                  isDark
                    ? "text-zinc-400"
                    : "text-zinc-600"
                }
              `}
            >
              DevTools Hub is a collection of
              practical tools designed to help
              developers perform common tasks
              quickly without unnecessary setup.
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}

      <section>
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">

            {/* What We Offer */}

            <div
              className={`
                rounded-2xl
                border
                p-6
                ${
                  isDark
                    ? "border-zinc-800 bg-zinc-900"
                    : "border-zinc-200 bg-white"
                }
              `}
            >
              <h2
                className={`
                  text-xl
                  font-semibold
                  ${
                    isDark
                      ? "text-white"
                      : "text-zinc-900"
                  }
                `}
              >
                What we offer
              </h2>

              <p
                className={`
                  mt-3
                  text-sm
                  leading-6
                  ${
                    isDark
                      ? "text-zinc-400"
                      : "text-zinc-600"
                  }
                `}
              >
                DevTools Hub provides tools for
                working with JSON, JWT, Base64,
                CSV, regular expressions, images,
                UUIDs and other common development
                tasks.
              </p>
            </div>

            {/* Privacy */}

            <div
              className={`
                rounded-2xl
                border
                p-6
                ${
                  isDark
                    ? "border-zinc-800 bg-zinc-900"
                    : "border-zinc-200 bg-white"
                }
              `}
            >
              <h2
                className={`
                  text-xl
                  font-semibold
                  ${
                    isDark
                      ? "text-white"
                      : "text-zinc-900"
                  }
                `}
              >
                Privacy focused
              </h2>

              <p
                className={`
                  mt-3
                  text-sm
                  leading-6
                  ${
                    isDark
                      ? "text-zinc-400"
                      : "text-zinc-600"
                  }
                `}
              >
                Our browser-based tools are designed
                to process data locally whenever
                possible. Your input can be handled
                directly in your browser without
                requiring unnecessary server uploads.
              </p>
            </div>

            {/* Simple & Fast */}

            <div
              className={`
                rounded-2xl
                border
                p-6
                ${
                  isDark
                    ? "border-zinc-800 bg-zinc-900"
                    : "border-zinc-200 bg-white"
                }
              `}
            >
              <h2
                className={`
                  text-xl
                  font-semibold
                  ${
                    isDark
                      ? "text-white"
                      : "text-zinc-900"
                  }
                `}
              >
                Simple and fast
              </h2>

              <p
                className={`
                  mt-3
                  text-sm
                  leading-6
                  ${
                    isDark
                      ? "text-zinc-400"
                      : "text-zinc-600"
                  }
                `}
              >
                Each tool focuses on doing one task
                clearly and efficiently. No complicated
                workflow is required for everyday
                developer utilities.
              </p>
            </div>

            {/* Browser Based */}

            <div
              className={`
                rounded-2xl
                border
                p-6
                ${
                  isDark
                    ? "border-zinc-800 bg-zinc-900"
                    : "border-zinc-200 bg-white"
                }
              `}
            >
              <h2
                className={`
                  text-xl
                  font-semibold
                  ${
                    isDark
                      ? "text-white"
                      : "text-zinc-900"
                  }
                `}
              >
                Built for developers
              </h2>

              <p
                className={`
                  mt-3
                  text-sm
                  leading-6
                  ${
                    isDark
                      ? "text-zinc-400"
                      : "text-zinc-600"
                  }
                `}
              >
                The collection is built around
                everyday development needs, making
                common utilities easy to find and use
                from one place.
              </p>
            </div>
          </div>

          {/* Explore Tools */}

          <div
            className={`
              mt-12
              rounded-2xl
              border
              p-8
              text-center
              ${
                isDark
                  ? "border-zinc-800 bg-zinc-900"
                  : "border-zinc-200 bg-white"
              }
            `}
          >
            <h2
              className={`
                text-2xl
                font-bold
                ${
                  isDark
                    ? "text-white"
                    : "text-zinc-900"
                }
              `}
            >
              Explore the tools
            </h2>

            <p
              className={`
                mx-auto
                mt-3
                max-w-xl
                text-sm
                leading-6
                ${
                  isDark
                    ? "text-zinc-400"
                    : "text-zinc-600"
                }
              `}
            >
              Explore the available developer tools
              and find the right utility for your
              workflow.
            </p>

            <Link
              href="/#tools"
              className={`
                mt-6
                inline-flex
                rounded-xl
                px-5
                py-2.5
                text-sm
                font-medium
                transition
                ${
                  isDark
                    ? "bg-white text-zinc-900 hover:bg-zinc-200"
                    : "bg-zinc-900 text-white hover:bg-zinc-800"
                }
              `}
            >
              Explore Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}

      <Footer theme={theme} />
    </main>
  );
}