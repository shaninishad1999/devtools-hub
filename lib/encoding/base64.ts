export interface Base64DecodeResult {
  success: boolean;
  result: string;
  error: string | null;
}

export function decodeBase64(
  input: string
): Base64DecodeResult {
  if (!input.trim()) {
    return {
      success: false,
      result: "",
      error: "Base64 input is empty.",
    };
  }

  try {
    const cleanedInput = input
      .trim()
      .replace(/\s/g, "");

    /*
     * Valid Base64 characters:
     * A-Z
     * a-z
     * 0-9
     * +
     * /
     * Optional padding =
     */

    if (
      !/^[A-Za-z0-9+/]*={0,2}$/.test(
        cleanedInput
      )
    ) {
      return {
        success: false,
        result: "",
        error: "Invalid Base64 string.",
      };
    }

    /*
     * Base64 length cannot have
     * remainder 1 when divided by 4.
     */

    if (cleanedInput.length % 4 === 1) {
      return {
        success: false,
        result: "",
        error: "Invalid Base64 length.",
      };
    }

    const decoded = atob(cleanedInput);

    /*
     * Convert binary string
     * into Uint8Array.
     */

    const bytes = Uint8Array.from(
      decoded,
      (character) =>
        character.charCodeAt(0)
    );

    /*
     * Convert bytes to UTF-8 text.
     */

    const result = new TextDecoder(
      "utf-8",
      {
        fatal: false,
      }
    ).decode(bytes);

    return {
      success: true,
      result,
      error: null,
    };
  } catch {
    return {
      success: false,
      result: "",
      error:
        "Unable to decode Base64 input.",
    };
  }
}