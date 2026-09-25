"use client";

import Link from "next/link";
import { useState } from "react";

interface NavbarProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function Navbar({
  theme,
  onToggleTheme,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDark = theme === "dark";

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur ${
        isDark
          ? "border-zinc-800 bg-zinc-950/90"
          : "border-zinc-200 bg-zinc-50/90"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className={`text-lg font-bold tracking-tight transition ${
            isDark
              ? "text-white hover:text-zinc-300"
              : "text-zinc-900 hover:text-zinc-600"
          }`}
        >
          DevTools Hub
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          <Link
            href="/"
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              isDark
                ? "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                : "text-zinc-700 hover:bg-white hover:text-zinc-950"
            }`}
          >
            Home
          </Link>

          <Link
            href="/#tools"
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              isDark
                ? "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                : "text-zinc-700 hover:bg-white hover:text-zinc-950"
            }`}
          >
            Tools
          </Link>

          <Link
            href="/#categories"
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              isDark
                ? "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                : "text-zinc-700 hover:bg-white hover:text-zinc-950"
            }`}
          >
            Categories
          </Link>

          <Link
            href="/#about"
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              isDark
                ? "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                : "text-zinc-700 hover:bg-white hover:text-zinc-950"
            }`}
          >
            About
          </Link>

          {/* Theme */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className={`ml-2 cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium shadow-sm transition ${
              isDark
                ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </nav>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className={`cursor-pointer rounded-xl border px-3 py-2 text-sm font-medium transition ${
              isDark
                ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            className={`cursor-pointer rounded-xl border px-3 py-2 text-lg transition ${
              isDark
                ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          className={`border-t md:hidden ${
            isDark
              ? "border-zinc-800 bg-zinc-950"
              : "border-zinc-200 bg-zinc-50"
          }`}
        >
          <nav className="mx-auto flex w-full max-w-6xl flex-col px-4 py-4 sm:px-6">
            <Link
              href="/"
              onClick={closeMenu}
              className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                isDark
                  ? "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  : "text-zinc-700 hover:bg-white hover:text-zinc-950"
              }`}
            >
              Home
            </Link>

            <Link
              href="/#tools"
              onClick={closeMenu}
              className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                isDark
                  ? "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  : "text-zinc-700 hover:bg-white hover:text-zinc-950"
              }`}
            >
              Tools
            </Link>

            <Link
              href="/#categories"
              onClick={closeMenu}
              className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                isDark
                  ? "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  : "text-zinc-700 hover:bg-white hover:text-zinc-950"
              }`}
            >
              Categories
            </Link>

            <Link
              href="/#about"
              onClick={closeMenu}
              className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                isDark
                  ? "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  : "text-zinc-700 hover:bg-white hover:text-zinc-950"
              }`}
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}