"use client";

import Editor from "@monaco-editor/react";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  theme: "light" | "dark";
  height?: string;
  readOnly?: boolean;
}

export default function JsonEditor({
  value,
  onChange,
  theme,
  height = "350px",
  readOnly = false,
}: JsonEditorProps) {
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
        language="json"
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

          folding: true,

          bracketPairColorization: {
            enabled: true,
          },

          matchBrackets: "always",

          autoClosingBrackets: "always",

          autoClosingQuotes: "always",

          cursorBlinking: "smooth",

          stickyScroll: {
            enabled: false,
          },

          wrappingIndent: "indent",

          suggestOnTriggerCharacters:
            !readOnly,

          quickSuggestions:
            !readOnly,
        }}
      />
    </div>
  );
}