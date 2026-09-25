"use client";

import Link from "next/link";

interface ToolCardProps {
  theme: "light" | "dark";
  name: string;
  description: string;
  icon: string;
  href: string;
}

export default function ToolCard({
  theme,
  name,
  description,
  icon,
  href,
}: ToolCardProps) {
  const isDark = theme === "dark";

  return (
    <Link
      href={href}
      className={`
        group
        rounded-2xl
        border
        p-6
        transition-all
        ${
          isDark
            ? "border-zinc-800 bg-zinc-900 hover:border-zinc-600 hover:bg-zinc-900/80"
            : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"
        }
      `}
    >
      <div className="mb-5 flex items-center justify-between">
        <div
          className={`
            flex
            h-11
            w-11
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
          {icon}
        </div>

        <span
          className={`
            text-sm
            transition-transform
            group-hover:translate-x-1
            ${
              isDark
                ? "text-zinc-400"
                : "text-zinc-500"
            }
          `}
        >
          →
        </span>
      </div>

      <h3
        className={`
          font-semibold
          ${
            isDark
              ? "text-white"
              : "text-zinc-900"
          }
        `}
      >
        {name}
      </h3>

      <p
        className={`
          mt-2
          text-sm
          leading-6
          ${
            isDark
              ? "text-zinc-400"
              : "text-zinc-600"
          }
        `}
      >
        {description}
      </p>
    </Link>
  );
}