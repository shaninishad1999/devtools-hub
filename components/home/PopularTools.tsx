"use client";

import ToolCard from "@/components/home/ToolCard";

interface PopularToolsProps {
  theme: "light" | "dark";
}

const tools = [
  {
    name: "JSON Formatter",
    description:
      "Format, validate and organize JSON data quickly.",
    icon: "{}",
    href: "/json-formatter",
  },
  {
    name: "JWT Decoder",
    description:
      "Decode JWT tokens and inspect their header and payload.",
    icon: "🔐",
    href: "/jwt-decoder",
  },
  {
    name: "Base64 Encoder",
    description:
      "Encode text and data into Base64 format locally.",
    icon: "🔤",
    href: "/base64-encoder",
  },
  {
    name: "Base64 Decoder",
    description:
      "Decode Base64 encoded text and data directly in your browser.",
    icon: "🔓",
    href: "/base64-decoder",
  },
  {
    name: "JSON to CSV",
    description:
      "Convert JSON data into CSV format quickly and locally.",
    icon: "📄",
    href: "/json-to-csv",
  },
  {
    name: "CSV to JSON",
    description:
      "Convert CSV files and data into JSON format.",
    icon: "📊",
    href: "/csv-to-json",
  },
  {
    name: "Regex Tester",
    description:
      "Test and validate regular expressions against text.",
    icon: "</>",
    href: "/regex-tester",
  },
  {
    name: "Image Compressor",
    description:
      "Compress images while keeping good visual quality.",
    icon: "🖼️",
    href: "/image-compressor",
  },
  {
    name: "UUID Generator",
    description:
      "Generate unique UUIDs directly in your browser.",
    icon: "🆔",
    href: "/uuid-generator",
  },
  {
  name: "File to ZIP",
  description:
    "Combine multiple files into a single ZIP archive directly in your browser.",
  icon: "📦",
  href: "/file-to-zip",
},
];

export default function PopularTools({
  theme,
}: PopularToolsProps) {
  const isDark = theme === "dark";

  return (
    <section
      id="tools"
      className={`
        scroll-mt-20
        border-t
        ${
          isDark
            ? "border-zinc-800"
            : "border-zinc-200"
        }
      `}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}

        <div className="mb-8">
          <h2
            className={`
              text-2xl
              font-bold
              tracking-tight
              ${
                isDark
                  ? "text-white"
                  : "text-zinc-900"
              }
            `}
          >
            Popular Tools
          </h2>

          <p
            className={`
              mt-2
              text-sm
              ${
                isDark
                  ? "text-zinc-400"
                  : "text-zinc-600"
              }
            `}
          >
            Frequently used tools for everyday
            development tasks.
          </p>
        </div>

        {/* Tools Grid */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard
              key={tool.name}
              theme={theme}
              name={tool.name}
              description={tool.description}
              icon={tool.icon}
              href={tool.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}