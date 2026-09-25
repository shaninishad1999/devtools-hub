"use client";

import { useState } from "react";

import JwtEditor from "@/components/tools/jwt/JwtEditor";
import JwtSection from "@/components/tools/jwt/JwtSection";

import {
  decodeJwt,
  formatJwtJson,
  getExpirationStatus,
  getIssuedAt,
  JwtDecodedResult,
} from "@/lib/jwt/jwt-utils";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const exampleJwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiU2hhbmkiLCJyb2xlIjoiZGV2ZWxvcGVyIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjQxMDAwMDAwMDB9.example-signature";

export default function JwtDecoderPage() {
  const [token, setToken] = useState("");

  const [theme, setTheme] =
    useState<"light" | "dark">("light");
const toggleTheme = () => {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  };
  const [result, setResult] =
    useState<JwtDecodedResult>({
      valid: false,
      header: null,
      payload: null,
      signature: null,
      error: null,
    });

  // ==================================
  // TOAST
  // ==================================

  const [toast, setToast] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToast({
      type,
      message,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // ==================================
  // DECODE
  // ==================================

  const handleDecode = () => {
    const decoded = decodeJwt(token);

    setResult(decoded);

    if (decoded.valid) {
      showToast(
        "JWT decoded successfully.",
        "success"
      );
    } else {
      showToast(
        decoded.error || "Invalid JWT.",
        "error"
      );
    }
  };

  // ==================================
  // COPY
  // ==================================

  const handleCopy = async (
    value: string,
    label: string
  ) => {
    if (!value) {
      showToast(
        `No ${label} available to copy.`,
        "error"
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(value);

      showToast(
        `${label} copied to clipboard.`,
        "success"
      );
    } catch {
      showToast(
        `Unable to copy ${label}.`,
        "error"
      );
    }
  };

  // ==================================
  // CLEAR
  // ==================================

  const handleClear = () => {
    setToken("");

    setResult({
      valid: false,
      header: null,
      payload: null,
      signature: null,
      error: null,
    });

    showToast(
      "JWT input cleared.",
      "success"
    );
  };

  // ==================================
  // EXAMPLE
  // ==================================

  const handleExample = () => {
    setToken(exampleJwt);

    setResult({
      valid: false,
      header: null,
      payload: null,
      signature: null,
      error: null,
    });

    showToast(
      "Example JWT loaded. Click Decode JWT.",
      "info"
    );
  };

  // ==================================
  // THEME
  // ==================================

  const handleThemeToggle = () => {
    setTheme((current) => {
      const newTheme =
        current === "light"
          ? "dark"
          : "light";

      showToast(
        `${newTheme === "dark" ? "Dark" : "Light"} mode enabled.`,
        "info"
      );

      return newTheme;
    });
  };

  // ==================================
  // EXPIRATION
  // ==================================

  const expiration =
    getExpirationStatus(result.payload);

  const issuedAt =
    getIssuedAt(result.payload);

  return (
    <main
      className={`
        min-h-screen
        ${
          theme === "dark"
            ? "bg-zinc-950 text-zinc-50"
            : "bg-zinc-50 text-zinc-900"
        }
      `}
    >

      {/* ==================================
          TOAST
      ================================== */}
{/* Navbar */}

      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      {toast && (
        <div
          className="
            fixed
            right-5
            top-5
            z-50
            animate-in
            fade-in
            slide-in-from-top-2
            duration-200
          "
        >
          <div
            className={`
              flex
              min-w-[280px]
              items-center
              gap-3
              rounded-xl
              border
              px-4
              py-3
              shadow-lg
              backdrop-blur
              ${
                toast.type === "success"
                  ? `
                    border-green-200
                    bg-green-50
                    text-green-800
                    dark:border-green-900
                    dark:bg-green-950
                    dark:text-green-300
                  `
                  : toast.type === "error"
                  ? `
                    border-red-200
                    bg-red-50
                    text-red-800
                    dark:border-red-900
                    dark:bg-red-950
                    dark:text-red-300
                  `
                  : `
                    border-blue-200
                    bg-blue-50
                    text-blue-800
                    dark:border-blue-900
                    dark:bg-blue-950
                    dark:text-blue-300
                  `
              }
            `}
          >

            {/* Icon */}

            <div
              className={`
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-full
                text-sm
                font-bold
                text-white
                ${
                  toast.type === "success"
                    ? "bg-green-600"
                    : toast.type === "error"
                    ? "bg-red-600"
                    : "bg-blue-600"
                }
              `}
            >
              {toast.type === "success"
                ? "✓"
                : toast.type === "error"
                ? "!"
                : "i"}
            </div>

            {/* Message */}

            <p className="text-sm font-medium">
              {toast.message}
            </p>

            {/* Close */}

            <button
              type="button"
              onClick={() => setToast(null)}
              className="
                ml-auto
                cursor-pointer
                text-lg
                leading-none
                opacity-60
                transition
                hover:opacity-100
              "
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ==================================
            HEADER
        ================================== */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            JWT Decoder
          </h1>

          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Decode and inspect JWT header,
            payload and signature directly
            in your browser.
          </p>
        </div>

        {/* ==================================
            TOKEN INPUT
        ================================== */}

        <div className="mb-4">

          <div className="mb-2 flex items-center justify-between">

            <h2 className="text-sm font-semibold">
              JWT Token
            </h2>

            <button
              type="button"
              onClick={handleExample}
              className="
                cursor-pointer
                text-xs
                font-medium
                text-blue-600
                hover:underline
                dark:text-blue-400
              "
            >
              Load Example
            </button>

          </div>

          <JwtEditor
            value={token}
            onChange={(value) => {
              setToken(value);

              setResult({
                valid: false,
                header: null,
                payload: null,
                signature: null,
                error: null,
              });
            }}
            theme={theme}
          />

        </div>

        {/* ==================================
            TOOLBAR
        ================================== */}

        <div className="mb-6 flex flex-wrap items-center gap-2">

          {/* Decode */}

      <button
  type="button"
  onClick={handleDecode}
  className="
    cursor-pointer
    rounded-lg
    bg-black
    px-4
    py-2
    text-sm
    font-medium
    text-white
    transition
    hover:bg-zinc-800
    dark:bg-zinc-100
    dark:text-zinc-900
    dark:hover:bg-zinc-200
  "
>
  Decode JWT
</button>
          {/* Clear */}

        {/* Clear */}

<button
  type="button"
  onClick={handleClear}
  className="
    cursor-pointer
    rounded-lg
    border
    border-zinc-300
    bg-white
    px-4
    py-2
    text-sm
    font-medium
    text-zinc-900
    transition
    hover:bg-zinc-100
    dark:border-zinc-700
    dark:bg-zinc-900
    dark:text-zinc-100
    dark:hover:bg-zinc-800
  "
>
  Clear
</button>

        </div>

        {/* ==================================
            ERROR
        ================================== */}

        {!result.valid && result.error && (
          <div
            className="
              mb-6
              rounded-xl
              border
              border-red-200
              bg-red-50
              p-4
              dark:border-red-900/50
              dark:bg-red-950/30
            "
          >
            <div className="flex gap-3">

              <div
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-red-600
                  text-sm
                  font-bold
                  text-white
                "
              >
                !
              </div>

              <div>

                <h3
                  className="
                    font-semibold
                    text-red-800
                    dark:text-red-300
                  "
                >
                  Invalid JWT
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-red-700
                    dark:text-red-400
                  "
                >
                  {result.error}
                </p>

              </div>
            </div>
          </div>
        )}

        {/* ==================================
            SUCCESS
        ================================== */}

        {result.valid && (
          <>
            {/* STATUS */}

          {/* STATUS */}

<div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

  {/* Structure */}
  <div
    className="
      rounded-xl
      border
      border-green-200
      bg-green-50
      p-4
      dark:border-green-900/50
      dark:bg-green-950/30
    "
  >
    <p
      className="
        text-xs
        font-medium
        uppercase
        tracking-wide
        text-green-700
        dark:text-green-400
      "
    >
      Structure
    </p>

    <p
      className="
        mt-1
        font-semibold
        text-green-800
        dark:text-green-200
      "
    >
      Valid JWT
    </p>
  </div>

  {/* Expiration */}
  <div
    className="
      rounded-xl
      border
      border-zinc-200
      bg-white
      p-4
      dark:border-zinc-800
      dark:bg-zinc-900
    "
  >
    <p
      className="
        text-xs
        font-medium
        uppercase
        tracking-wide
        text-zinc-500
        dark:text-zinc-400
      "
    >
      Expiration
    </p>

    <p
      className="
        mt-1
        font-semibold
        text-zinc-900
        dark:text-zinc-100
      "
    >
      {!expiration.hasExpiration
        ? "Not provided"
        : expiration.expired
        ? "Expired"
        : "Not expired"}
    </p>

    {expiration.expirationDate && (
      <p
        className="
          mt-1
          text-xs
          text-zinc-600
          dark:text-zinc-400
        "
      >
        {expiration.expirationDate.toLocaleString()}
      </p>
    )}
  </div>

  {/* Issued At */}
  <div
    className="
      rounded-xl
      border
      border-zinc-200
      bg-white
      p-4
      dark:border-zinc-800
      dark:bg-zinc-900
    "
  >
    <p
      className="
        text-xs
        font-medium
        uppercase
        tracking-wide
        text-zinc-500
        dark:text-zinc-400
      "
    >
      Issued At
    </p>

    <p
      className="
        mt-1
        font-semibold
        text-zinc-900
        dark:text-zinc-100
      "
    >
      {issuedAt
        ? issuedAt.toLocaleString()
        : "Not provided"}
    </p>
  </div>

</div>

            {/* ==================================
                HEADER
            ================================== */}

            <div className="mb-4">

              <JwtSection
                title="Header"
                description="JWT algorithm and token type"
                value={formatJwtJson(result.header)}
                onCopy={() =>
                  handleCopy(
                    formatJwtJson(result.header),
                    "Header"
                  )
                }
                theme={theme}
              />

            </div>

            {/* ==================================
                PAYLOAD
            ================================== */}

            <div className="mb-4">

              <JwtSection
                title="Payload"
                description="JWT claims and data"
                value={formatJwtJson(result.payload)}
                onCopy={() =>
                  handleCopy(
                    formatJwtJson(result.payload),
                    "Payload"
                  )
                }
                theme={theme}
              />

            </div>

            {/* ==================================
                SIGNATURE
            ================================== */}

            <JwtSection
              title="Signature"
              description="Encoded JWT signature"
              value={result.signature || ""}
              onCopy={() =>
                handleCopy(
                  result.signature || "",
                  "Signature"
                )
              }
              theme={theme}
            />

          </>
        )}

        {/* ==================================
            PRIVACY
        ================================== */}

        <div className="mt-6 text-sm text-zinc-500">
          JWT decoding is performed locally
          in your browser. Your token is not
          sent to a server.
        </div>

      </div>
        <Footer theme={theme} />
    </main>
  );
}