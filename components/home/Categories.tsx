"use client";

import CategoryCard from "@/components/home/CategoryCard";

interface CategoriesProps {
  theme: "light" | "dark";
}

const categories = [
  {
    name: "JSON Tools",
    description:
      "Format, validate and work with JSON data quickly.",
    icon: "{}",
    toolCount: 1,
    href: "/json-formatter",
  },
  {
    name: "JWT Tools",
    description:
      "Decode and inspect JSON Web Tokens easily.",
    icon: "🔐",
    toolCount: 1,
    href: "/jwt-decoder",
  },
  {
    name: "Encoding Tools",
    description:
      "Encode and decode Base64 data directly in your browser.",
    icon: "🔤",
    toolCount: 2,
    href: "/base64-encoder",
  },
  {
    name: "Regex Tools",
    description:
      "Test and validate regular expressions against text.",
    icon: "</>",
    toolCount: 1,
    href: "/regex-tester",
  },
  {
    name: "Image Tools",
    description:
      "Compress images directly in your browser.",
    icon: "🖼️",
    toolCount: 1,
    href: "/image-compressor",
  },
  {
    name: "CSV Tools",
    description:
      "Convert CSV data to JSON and JSON data to CSV.",
    icon: "📊",
    toolCount: 2,
    href: "/csv-to-json",
  },
  {
    name: "Generators",
    description:
      "Generate unique UUIDs and other useful values.",
    icon: "⚙️",
    toolCount: 1,
    href: "/uuid-generator",
  },
];

export default function Categories({
  theme,
}: CategoriesProps) {
  const isDark = theme === "dark";

  return (
    <section
      id="categories"
      className={`
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
            Tool Categories
          </h2>

          <p
            className={`
              mt-2
              max-w-2xl
              text-sm
              ${
                isDark
                  ? "text-zinc-400"
                  : "text-zinc-600"
              }
            `}
          >
            Browse developer tools by category and
            find exactly what you need.
          </p>
        </div>

        {/* Categories Grid */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              theme={theme}
              name={category.name}
              description={category.description}
              icon={category.icon}
              toolCount={category.toolCount}
              href={category.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}