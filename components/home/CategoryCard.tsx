"use client";

import Link from "next/link";

interface CategoryCardProps {
  theme: "light" | "dark";
  name: string;
  description: string;
  icon: string;
  toolCount: number;
  href: string;
}

export default function CategoryCard({
  theme,
  name,
  description,
  icon,
  toolCount,
  href,
}: CategoryCardProps) {
  const isDark = theme === "dark";

  return (
    <Link
      href={href}
      className={`
        group
        rounded-2xl
        border
        p-5
        transition-all
        ${
          isDark
            ? "border-zinc-800 bg-zinc-900 hover:border-zinc-600 hover:bg-zinc-900/80"
            : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"
        }
      `}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Icon */}

        <div
          className={`
            flex
            h-11
            w-11
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
          {icon}
        </div>

        {/* Arrow */}

        <span
          className={`
            text-sm
            transition-transform
            group-hover:translate-x-1
            ${
              isDark
                ? "text-zinc-500"
                : "text-zinc-400"
            }
          `}
        >
          →
        </span>
      </div>

      {/* Name */}

      <h3
        className={`
          mt-5
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

      {/* Description */}

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

      {/* Tool Count */}

      <div
        className={`
          mt-4
          text-xs
          font-medium
          ${
            isDark
              ? "text-zinc-500"
              : "text-zinc-500"
          }
        `}
      >
        {toolCount}{" "}
        {toolCount === 1 ? "Tool" : "Tools"}
      </div>
    </Link>
  );
}