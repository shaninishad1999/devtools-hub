export interface JwtDecodedResult {
  valid: boolean;
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string | null;
  error: string | null;
}

function decodeBase64Url(value: string): string {
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const padded =
    base64 + "=".repeat((4 - (base64.length % 4)) % 4);

  const binary = atob(padded);

  const bytes = Uint8Array.from(
    binary,
    (char) => char.charCodeAt(0)
  );

  return new TextDecoder().decode(bytes);
}

function decodeJsonPart(
  value: string
): Record<string, unknown> {
  const decoded = decodeBase64Url(value);
  const parsed = JSON.parse(decoded);

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    Array.isArray(parsed)
  ) {
    throw new Error("JWT section must contain a JSON object.");
  }

  return parsed as Record<string, unknown>;
}

export function decodeJwt(
  token: string
): JwtDecodedResult {
  const cleanToken = token.trim();

  if (!cleanToken) {
    return {
      valid: false,
      header: null,
      payload: null,
      signature: null,
      error: "Please enter a JWT token.",
    };
  }

  const parts = cleanToken.split(".");

  if (parts.length !== 3) {
    return {
      valid: false,
      header: null,
      payload: null,
      signature: null,
      error:
        "Invalid JWT structure. A JWT must contain three parts separated by dots.",
    };
  }

  try {
    const header = decodeJsonPart(parts[0]);
    const payload = decodeJsonPart(parts[1]);

    return {
      valid: true,
      header,
      payload,
      signature: parts[2],
      error: null,
    };
  } catch (error) {
    return {
      valid: false,
      header: null,
      payload: null,
      signature: parts[2] || null,
      error:
        error instanceof Error
          ? error.message
          : "Unable to decode JWT.",
    };
  }
}

export function formatJwtJson(
  data: Record<string, unknown> | null
): string {
  if (!data) {
    return "";
  }

  return JSON.stringify(data, null, 2);
}

export function getExpirationStatus(
  payload: Record<string, unknown> | null
): {
  hasExpiration: boolean;
  expired: boolean | null;
  expirationDate: Date | null;
} {
  if (!payload) {
    return {
      hasExpiration: false,
      expired: null,
      expirationDate: null,
    };
  }

  const exp = payload.exp;

  if (
    typeof exp !== "number" ||
    !Number.isFinite(exp)
  ) {
    return {
      hasExpiration: false,
      expired: null,
      expirationDate: null,
    };
  }

  const expirationDate = new Date(exp * 1000);

  return {
    hasExpiration: true,
    expired: expirationDate.getTime() <= Date.now(),
    expirationDate,
  };
}

export function getIssuedAt(
  payload: Record<string, unknown> | null
): Date | null {
  if (!payload) {
    return null;
  }

  const iat = payload.iat;

  if (
    typeof iat !== "number" ||
    !Number.isFinite(iat)
  ) {
    return null;
  }

  return new Date(iat * 1000);
}