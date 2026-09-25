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
  const isDark = theme === "dark";

  return (
    <div
      className={`overflow-hidden rounded-xl border shadow-sm ${
        isDark
          ? "border-zinc-800 bg-zinc-900"
          : "border-zinc-200 bg-white"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between border-b px-4 py-3 ${
          isDark
            ? "border-zinc-800"
            : "border-zinc-200"
        }`}
      >
        <div>
          <h2
            className={`font-semibold ${
              isDark
                ? "text-zinc-100"
                : "text-zinc-900"
            }`}
          >
            {title}
          </h2>

          <p
            className={`mt-0.5 text-xs ${
              isDark
                ? "text-zinc-400"
                : "text-zinc-500"
            }`}
          >
            {description}
          </p>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={onCopy}
          className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
            isDark
              ? "border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
              : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
          }`}
        >
          Copy
        </button>
      </div>

      {/* Output */}
      <pre
        className={`max-h-80 overflow-auto p-4 text-sm leading-6 whitespace-pre-wrap break-words ${
          isDark
            ? "bg-zinc-900 text-zinc-100"
            : "bg-white text-zinc-800"
        }`}
      >
        {value || "No data available."}
      </pre>
    </div>
  );
}