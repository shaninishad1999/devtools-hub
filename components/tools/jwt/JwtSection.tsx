"use client";

interface JwtSectionProps {
  title: string;
  description: string;
  value: string;
  onCopy: () => void;
  theme: "light" | "dark";
}

export default function JwtSection({
  title,
  description,
  value,
  onCopy,
  theme,
}: JwtSectionProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <div>
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>

          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={onCopy}
          className="cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          Copy
        </button>
      </div>

      <pre
        className={`max-h-80 overflow-auto p-4 text-sm leading-6 ${
          theme === "dark"
            ? "text-zinc-300"
            : "text-zinc-800"
        }`}
      >
        {value || "No data available."}
      </pre>
    </div>
  );
}