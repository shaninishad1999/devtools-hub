export type JsonRecord = Record<string, unknown>;

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  let stringValue: string;

  if (typeof value === "object") {
    try {
      stringValue = JSON.stringify(value);
    } catch {
      stringValue = String(value);
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
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export function jsonToCsv(data: unknown): string {
  if (!Array.isArray(data)) {
    throw new Error(
      "JSON must contain an array of objects."
    );
  }

  if (data.length === 0) {
    throw new Error("JSON array is empty.");
  }

  const invalidIndex = data.findIndex(
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

  const records = data as JsonRecord[];

  const headers = Array.from(
    new Set(
      records.flatMap((item) => Object.keys(item))
    )
  );

  if (headers.length === 0) {
    throw new Error(
      "No columns found in JSON data."
    );
  }

  const headerRow = headers
    .map(escapeCsvValue)
    .join(",");

  const dataRows = records.map((item) =>
    headers
      .map((header) =>
        escapeCsvValue(item[header])
      )
      .join(",")
  );

  return [headerRow, ...dataRows].join("\n");
}