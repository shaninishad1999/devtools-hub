"use client";

import Editor from "@monaco-editor/react";

interface JwtEditorProps {
  value: string;
  onChange: (value: string) => void;
  theme: "light" | "dark";
}

export default function JwtEditor({
  value,
  onChange,
  theme,
}: JwtEditorProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <Editor
        height="180px"
        language="plaintext"
        theme={theme === "dark" ? "vs-dark" : "vs"}
        value={value}
        onChange={(value) => {
          onChange(value ?? "");
        }}
        options={{
          minimap: {
            enabled: false,
          },

          fontSize: 14,

          lineNumbers: "off",

          wordWrap: "on",

          automaticLayout: true,

          scrollBeyondLastLine: false,

          padding: {
            top: 14,
            bottom: 14,
          },

          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },

          stickyScroll: {
            enabled: false,
          },
        }}
      />
    </div>
  );
}