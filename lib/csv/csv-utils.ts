export interface CsvParseResult {
  success: boolean;
  data: Record<string, string>[];
  error: string | null;
  line: number | null;
  column: number | null;
}

/* =========================================================
   DELIMITER DETECTION
========================================================= */

function detectDelimiter(input: string): string {
  const lines = input
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .slice(0, 5);

  const delimiters = [",", "\t", ";", "|"];

  let bestDelimiter = ",";
  let bestCount = -1;

  for (const delimiter of delimiters) {
    let count = 0;

    for (const line of lines) {
      let insideQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          if (
            insideQuotes &&
            line[i + 1] === '"'
          ) {
            i++;
          } else {
            insideQuotes = !insideQuotes;
          }

          continue;
        }

        if (
          char === delimiter &&
          !insideQuotes
        ) {
          count++;
        }
      }
    }

    if (count > bestCount) {
      bestCount = count;
      bestDelimiter = delimiter;
    }
  }

  return bestDelimiter;
}

/* =========================================================
   CSV PARSER
========================================================= */

function parseCSV(
  input: string,
  delimiter: string
): string[][] {
  const rows: string[][] = [];

  let row: string[] = [];
  let value = "";
  let insideQuotes = false;

  for (
    let i = 0;
    i < input.length;
    i++
  ) {
    const char = input[i];
    const nextChar = input[i + 1];

    // Quotes
    if (char === '"') {
      if (
        insideQuotes &&
        nextChar === '"'
      ) {
        value += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }

      continue;
    }

    // Delimiter
    if (
      char === delimiter &&
      !insideQuotes
    ) {
      row.push(value);
      value = "";

      continue;
    }

    // New line
    if (
      (char === "\n" ||
        char === "\r") &&
      !insideQuotes
    ) {
      if (
        char === "\r" &&
        nextChar === "\n"
      ) {
        i++;
      }

      row.push(value);
      value = "";

      if (
        row.some(
          (cell) =>
            cell.trim() !== ""
        )
      ) {
        rows.push(row);
      }

      row = [];

      continue;
    }

    value += char;
  }

  if (insideQuotes) {
    throw new Error(
      "Unclosed quotation mark. Make sure every quoted value has a closing double quote."
    );
  }

  // Last row
  if (
    value !== "" ||
    row.length > 0
  ) {
    row.push(value);

    if (
      row.some(
        (cell) =>
          cell.trim() !== ""
      )
    ) {
      rows.push(row);
    }
  }

  return rows;
}

/* =========================================================
   NORMALIZE HEADERS
========================================================= */

function normalizeHeaders(
  headers: string[]
): string[] {
  const used = new Map<
    string,
    number
  >();

  return headers.map(
    (header, index) => {
      let name = header.trim();

      if (!name) {
        name = `column_${index + 1}`;
      }

      const count =
        used.get(name) ?? 0;

      used.set(
        name,
        count + 1
      );

      if (count === 0) {
        return name;
      }

      return `${name}_${count + 1}`;
    }
  );
}

/* =========================================================
   CSV → JSON
========================================================= */

export function csvToJson(
  input: string
): CsvParseResult {
  if (!input.trim()) {
    return {
      success: false,
      data: [],
      error: "CSV input is empty.",
      line: null,
      column: null,
    };
  }

  try {
    const delimiter =
      detectDelimiter(input);

    const rows = parseCSV(
      input,
      delimiter
    );

    if (rows.length === 0) {
      return {
        success: false,
        data: [],
        error: "No CSV data found.",
        line: null,
        column: null,
      };
    }

    const headers =
      normalizeHeaders(rows[0]);

    if (headers.length === 0) {
      return {
        success: false,
        data: [],
        error:
          "CSV header row is empty.",
        line: 1,
        column: 1,
      };
    }

    const data: Record<
      string,
      string
    >[] = rows
      .slice(1)
      .map((row) => {
        const object: Record<
          string,
          string
        > = {};

        headers.forEach(
          (header, index) => {
            object[header] =
              row[index] ?? "";
          }
        );

        return object;
      });

    return {
      success: true,
      data,
      error: null,
      line: null,
      column: null,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Unable to parse CSV.",
      line: null,
      column: null,
    };
  }
}

/* =========================================================
   CSV VALUE ESCAPER
========================================================= */

function escapeCSV(
  value: unknown
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  let stringValue: string;

  if (typeof value === "object") {
    try {
      stringValue =
        JSON.stringify(value);
    } catch {
      stringValue =
        String(value);
    }
  } else {
    stringValue = String(value);
  }

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replace(
      /"/g,
      '""'
    )}"`;
  }

  return stringValue;
}

/* =========================================================
   JSON → CSV
========================================================= */

export function jsonToCsv(
  data: Record<string, unknown>[]
): string {
  if (
    !Array.isArray(data) ||
    data.length === 0
  ) {
    throw new Error(
      "JSON must contain a non-empty array of objects."
    );
  }

  const invalidIndex =
    data.findIndex(
      (item) =>
        item === null ||
        typeof item !== "object" ||
        Array.isArray(item)
    );

  if (invalidIndex !== -1) {
    throw new Error(
      `Item ${invalidIndex + 1} must be a JSON object.`
    );
  }

  const headers =
    Array.from(
      new Set(
        data.flatMap(
          (item) =>
            Object.keys(item)
        )
      )
    );

  if (headers.length === 0) {
    throw new Error(
      "No columns found in JSON data."
    );
  }

  const headerRow =
    headers
      .map(escapeCSV)
      .join(",");

  const dataRows =
    data.map((item) =>
      headers
        .map((header) =>
          escapeCSV(
            item[header]
          )
        )
        .join(",")
    );

  return [
    headerRow,
    ...dataRows,
  ].join("\n");
}