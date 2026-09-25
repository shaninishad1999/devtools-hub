"use client";

import { useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/home/Hero";
import PopularTools from "@/components/home/PopularTools";
import Categories from "@/components/home/Categories";

export default function HomePage() {
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
        ${theme === "dark"
          ? "bg-zinc-950 text-zinc-50"
          : "bg-zinc-50 text-zinc-900"
        }
      `}
    >
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <Hero theme={theme} />

      <PopularTools theme={theme} />
      <Categories theme={theme} />
      <Footer theme={theme} />
    </main>
  );
}