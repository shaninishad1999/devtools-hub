import { jsonrepair } from "jsonrepair";

export interface JsonValidationResult {
  valid: boolean;
  error: string | null;
  line: number | null;
  column: number | null;
}

// ======================================
// FORMAT JSON
// ======================================

export function formatJson(input: string): string {
  if (!input.trim()) {
    throw new Error("JSON input is empty.");
  }

  const parsed = JSON.parse(input);

  return JSON.stringify(parsed, null, 2);
}

// ======================================
// MINIFY JSON
// ======================================

export function minifyJson(input: string): string {
  if (!input.trim()) {
    throw new Error("JSON input is empty.");
  }

  const parsed = JSON.parse(input);

  return JSON.stringify(parsed);
}

// ======================================
// GET ERROR POSITION
// ======================================

function getErrorPosition(
  input: string,
  errorMessage: string
): {
  line: number | null;
  column: number | null;
} {
  // Example:
  // Unexpected token } in JSON at position 45

  const positionMatch = errorMessage.match(
    /position\s+(\d+)/i
  );

  if (!positionMatch) {
    return {
      line: null,
      column: null,
    };
  }

  const position = Number(positionMatch[1]);

  const beforeError = input.slice(0, position);

  const line = beforeError.split("\n").length;

  const lastNewLine = beforeError.lastIndexOf("\n");

  const column =
    lastNewLine === -1
      ? position + 1
      : position - lastNewLine;

  return {
    line,
    column,
  };
}

// ======================================
// VALIDATE JSON
// ======================================

export function validateJson(
  input: string
): JsonValidationResult {
  if (!input.trim()) {
    return {
      valid: false,
      error: "JSON input is empty.",
      line: null,
      column: null,
    };
  }

  try {
    JSON.parse(input);

    return {
      valid: true,
      error: null,
      line: null,
      column: null,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Invalid JSON syntax.";

    const location = getErrorPosition(
      input,
      errorMessage
    );

    return {
      valid: false,
      error: errorMessage,
      line: location.line,
      column: location.column,
    };
  }
}

// ======================================
// REPAIR JSON
// ======================================

export function repairJson(input: string): string {
  if (!input.trim()) {
    throw new Error("JSON input is empty.");
  }

  // jsonrepair repairs common JSON problems:
  // missing quotes
  // missing commas
  // trailing commas
  // incomplete JSON
  // etc.

  const repaired = jsonrepair(input);

  // Verify repaired JSON
  const parsed = JSON.parse(repaired);

  return JSON.stringify(parsed, null, 2);
}