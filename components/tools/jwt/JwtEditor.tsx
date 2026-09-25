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
  const isDark = theme === "dark";

  return (
    <div
      className={`overflow-hidden rounded-xl border shadow-sm ${
        isDark
          ? "border-zinc-700 bg-zinc-900"
          : "border-zinc-300 bg-white"
      }`}
    >
      <Editor
        height="180px"
        language="plaintext"
        theme={isDark ? "vs-dark" : "vs"}
        value={value}
        onChange={(value) => {
          onChange(value ?? "");
        }}
        beforeMount={(monaco) => {
          monaco.editor.defineTheme("jwt-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [
              {
                token: "",
                foreground: "F4F4F5",
              },
              {
                token: "string",
                foreground: "86EFAC",
              },
            ],
            colors: {
              "editor.background": "#18181B",
              "editor.foreground": "#F4F4F5",
              "editorLineNumber.foreground": "#71717A",
              "editorLineNumber.activeForeground": "#A1A1AA",
              "editorCursor.foreground": "#FFFFFF",
              "editor.selectionBackground": "#3F3F46",
              "editor.inactiveSelectionBackground": "#27272A",
              "editor.lineHighlightBackground": "#18181B",
              "editorIndentGuide.background": "#27272A",
              "editorIndentGuide.activeBackground": "#3F3F46",
              "editorWidget.background": "#18181B",
              "editorWidget.border": "#3F3F46",
              "input.background": "#27272A",
              "input.foreground": "#F4F4F5",
            },
          });

          monaco.editor.defineTheme("jwt-light", {
            base: "vs",
            inherit: true,
            rules: [
              {
                token: "",
                foreground: "18181B",
              },
              {
                token: "string",
                foreground: "166534",
              },
            ],
            colors: {
              "editor.background": "#FFFFFF",
              "editor.foreground": "#18181B",
              "editorLineNumber.foreground": "#A1A1AA",
              "editorLineNumber.activeForeground": "#52525B",
              "editorCursor.foreground": "#18181B",
              "editor.selectionBackground": "#E4E4E7",
              "editor.inactiveSelectionBackground": "#F4F4F5",
              "editor.lineHighlightBackground": "#FAFAFA",
              "editorIndentGuide.background": "#E4E4E7",
              "editorIndentGuide.activeBackground": "#D4D4D8",
              "editorWidget.background": "#FFFFFF",
              "editorWidget.border": "#D4D4D8",
              "input.background": "#FFFFFF",
              "input.foreground": "#18181B",
            },
          });
        }}
        onMount={(editor, monaco) => {
          editor.updateOptions({
            padding: {
              top: 14,
              bottom: 14,
            },
          });

          editor.setScrollPosition({
            scrollTop: 0,
            scrollLeft: 0,
          });

          monaco.editor.setTheme(
            isDark ? "jwt-dark" : "jwt-light"
          );
        }}
        options={{
          minimap: {
            enabled: false,
          },

          fontSize: 14,

          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",

          fontWeight: "400",

          lineNumbers: "off",

          wordWrap: "on",

          wrappingStrategy: "advanced",

          automaticLayout: true,

          scrollBeyondLastLine: false,

          smoothScrolling: true,

          cursorBlinking: "smooth",

          cursorSmoothCaretAnimation: "on",

          renderWhitespace: "selection",

          renderLineHighlight: "none",

          folding: false,

          glyphMargin: false,

          guides: {
            indentation: false,
          },

          stickyScroll: {
            enabled: false,
          },

          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            useShadows: false,
          },

          overviewRulerLanes: 0,

          hideCursorInOverviewRuler: true,

          contextmenu: true,

          quickSuggestions: false,

          suggestOnTriggerCharacters: false,

          acceptSuggestionOnEnter: "off",

          tabCompletion: "off",

          parameterHints: {
            enabled: false,
          },

          wordBasedSuggestions: "off",

          occurrencesHighlight: "off",

          selectionHighlight: false,

          renderControlCharacters: false,

          unicodeHighlight: {
            ambiguousCharacters: false,
            invisibleCharacters: false,
            nonBasicASCII: false,
          },
        }}
      />
    </div>
  );
}