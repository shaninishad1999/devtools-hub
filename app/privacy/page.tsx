"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
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
      className={`min-h-screen flex flex-col ${
        isDark
          ? "bg-zinc-950 text-zinc-50"
          : "bg-zinc-50 text-zinc-900"
      }`}
    >
      {/* Navbar */}

      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Page Content */}

      <div className="flex-1">
        <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">

          {/* Header */}

          <div className="mb-10">
            <h1
              className={`text-3xl font-bold tracking-tight sm:text-4xl ${
                isDark
                  ? "text-white"
                  : "text-zinc-900"
              }`}
            >
              Privacy Policy
            </h1>

            <p
              className={`mt-3 text-sm ${
                isDark
                  ? "text-zinc-400"
                  : "text-zinc-600"
              }`}
            >
              Your privacy matters to us. DevTools Hub is
              designed to keep your developer data private.
            </p>
          </div>

          {/* Privacy Content */}

          <div className="space-y-8">

            {/* 1 */}

            <section>
              <h2
                className={`text-xl font-semibold ${
                  isDark
                    ? "text-white"
                    : "text-zinc-900"
                }`}
              >
                1. Overview
              </h2>

              <p
                className={`mt-3 leading-7 ${
                  isDark
                    ? "text-zinc-400"
                    : "text-zinc-600"
                }`}
              >
                DevTools Hub provides browser-based
                developer utilities such as JSON formatting,
                JWT decoding, Base64 encoding and decoding,
                regular expression testing, image compression,
                and other development tools.
              </p>
            </section>

            {/* 2 */}

            <section>
              <h2
                className={`text-xl font-semibold ${
                  isDark
                    ? "text-white"
                    : "text-zinc-900"
                }`}
              >
                2. Data Processing
              </h2>

              <p
                className={`mt-3 leading-7 ${
                  isDark
                    ? "text-zinc-400"
                    : "text-zinc-600"
                }`}
              >
                Most DevTools Hub tools process your data
                directly in your browser. Data entered into
                tools such as JSON Formatter, JWT Decoder,
                Base64 Encoder, Regex Tester, and similar
                utilities is not intentionally sent to our
                servers for processing.
              </p>
            </section>

            {/* 3 */}

            <section>
              <h2
                className={`text-xl font-semibold ${
                  isDark
                    ? "text-white"
                    : "text-zinc-900"
                }`}
              >
                3. Information We Collect
              </h2>

              <p
                className={`mt-3 leading-7 ${
                  isDark
                    ? "text-zinc-400"
                    : "text-zinc-600"
                }`}
              >
                DevTools Hub does not require an account for
                using the available developer tools. We do not
                intentionally collect the text, JSON, tokens,
                code, or other data that you enter into the
                browser-based tools.
              </p>
            </section>

            {/* 4 */}

            <section>
              <h2
                className={`text-xl font-semibold ${
                  isDark
                    ? "text-white"
                    : "text-zinc-900"
                }`}
              >
                4. Local Processing
              </h2>

              <p
                className={`mt-3 leading-7 ${
                  isDark
                    ? "text-zinc-400"
                    : "text-zinc-600"
                }`}
              >
                Wherever technically possible, tool operations
                are performed locally in your browser. This
                helps reduce unnecessary transmission of your
                data over the internet.
              </p>
            </section>

            {/* 5 */}

            <section>
              <h2
                className={`text-xl font-semibold ${
                  isDark
                    ? "text-white"
                    : "text-zinc-900"
                }`}
              >
                5. Third-Party Services
              </h2>

              <p
                className={`mt-3 leading-7 ${
                  isDark
                    ? "text-zinc-400"
                    : "text-zinc-600"
                }`}
              >
                Some parts of the website may use third-party
                services for hosting, analytics, security, or
                other website functionality. Those services may
                process limited technical information according
                to their own privacy policies.
              </p>
            </section>

            {/* 6 */}

            <section>
              <h2
                className={`text-xl font-semibold ${
                  isDark
                    ? "text-white"
                    : "text-zinc-900"
                }`}
              >
                6. Cookies
              </h2>

              <p
                className={`mt-3 leading-7 ${
                  isDark
                    ? "text-zinc-400"
                    : "text-zinc-600"
                }`}
              >
                DevTools Hub may use browser storage or
                similar technologies when required for website
                functionality, preferences, or settings.
              </p>
            </section>

            {/* 7 */}

            <section>
              <h2
                className={`text-xl font-semibold ${
                  isDark
                    ? "text-white"
                    : "text-zinc-900"
                }`}
              >
                7. Security
              </h2>

              <p
                className={`mt-3 leading-7 ${
                  isDark
                    ? "text-zinc-400"
                    : "text-zinc-600"
                }`}
              >
                We aim to keep DevTools Hub secure and minimize
                unnecessary collection or transmission of user
                data. However, no website or internet
                transmission can be guaranteed to be completely
                secure.
              </p>
            </section>

            {/* 8 */}

            <section>
              <h2
                className={`text-xl font-semibold ${
                  isDark
                    ? "text-white"
                    : "text-zinc-900"
                }`}
              >
                8. Changes to This Privacy Policy
              </h2>

              <p
                className={`mt-3 leading-7 ${
                  isDark
                    ? "text-zinc-400"
                    : "text-zinc-600"
                }`}
              >
                This Privacy Policy may be updated from time
                to time to reflect changes to DevTools Hub,
                its features, or applicable requirements.
              </p>
            </section>

            {/* 9 */}

            <section>
              <h2
                className={`text-xl font-semibold ${
                  isDark
                    ? "text-white"
                    : "text-zinc-900"
                }`}
              >
                9. Contact
              </h2>

              <p
                className={`mt-3 leading-7 ${
                  isDark
                    ? "text-zinc-400"
                    : "text-zinc-600"
                }`}
              >
                If you have questions about this Privacy Policy
                or how DevTools Hub handles information, please
                contact the DevTools Hub team.
              </p>
            </section>

          </div>

          {/* Last Updated */}

          <div
            className={`mt-10 border-t pt-6 text-sm ${
              isDark
                ? "border-zinc-800 text-zinc-500"
                : "border-zinc-200 text-zinc-500"
            }`}
          >
            Last updated: September 2026
          </div>

        </div>
      </div>

      {/* Footer */}

      <Footer theme={theme} />
    </main>
  );
}