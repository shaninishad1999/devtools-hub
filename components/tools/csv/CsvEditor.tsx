"use client";

import Editor from "@monaco-editor/react";

interface CsvEditorProps {
  value: string;
  onChange: (value: string) => void;

  theme: "light" | "dark";

  language?: "plaintext" | "json";

  height?: string;

  readOnly?: boolean;
}

export default function CsvEditor({
  value,
  onChange,
  theme,
  language = "plaintext",
  height = "350px",
  readOnly = false,
}: CsvEditorProps) {
  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border
        border-zinc-300
        bg-white
        shadow-sm
        dark:border-zinc-700
        dark:bg-zinc-900
      "
    >
      <Editor
        height={height}
        language={language}
        theme={
          theme === "dark"
            ? "vs-dark"
            : "vs"
        }
        value={value}
        onChange={(value) => {
          if (!readOnly) {
            onChange(value ?? "");
          }
        }}
        options={{
          readOnly,

          minimap: {
            enabled: false,
          },

          fontSize: 14,

          lineNumbers: "on",

          wordWrap: "on",

          automaticLayout: true,

          tabSize: 2,

          insertSpaces: true,

          formatOnPaste: false,

          scrollBeyondLastLine: false,

          padding: {
            top: 12,
            bottom: 12,
          },

          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },

          folding:
            language === "json",

          bracketPairColorization: {
            enabled:
              language === "json",
          },

          matchBrackets:
            language === "json"
              ? "always"
              : "never",

          autoClosingBrackets:
            language === "json"
              ? "always"
              : "never",

          autoClosingQuotes:
            language === "json"
              ? "always"
              : "never",

          cursorBlinking: "smooth",

          stickyScroll: {
            enabled: false,
          },

          wrappingIndent:
            language === "json"
              ? "indent"
              : "none",

          suggestOnTriggerCharacters:
            language === "json",

          quickSuggestions:
            language === "json",
        }}
      />
    </div>
  );
}