export interface RegexMatch {
  value: string;
  index: number;
}

export interface RegexTestResult {
  valid: boolean;
  matches: RegexMatch[];
  error: string | null;
}

export interface RegexOptions {
  global?: boolean;
  ignoreCase?: boolean;
  multiline?: boolean;
  dotAll?: boolean;
  unicode?: boolean;
  sticky?: boolean;
}

export function buildRegex(
  pattern: string,
  options: RegexOptions = {}
): RegExp {
  if (!pattern.trim()) {
    throw new Error("Please enter a regular expression.");
  }

  const flags = [
    options.global ? "g" : "",
    options.ignoreCase ? "i" : "",
    options.multiline ? "m" : "",
    options.dotAll ? "s" : "",
    options.unicode ? "u" : "",
    options.sticky ? "y" : "",
  ].join("");

  return new RegExp(pattern, flags);
}

export function testRegex(
  pattern: string,
  text: string,
  options: RegexOptions = {}
): RegexTestResult {
  try {
    const regex = buildRegex(pattern, {
      global: true,
      ...options,
    });

    const matches: RegexMatch[] = [];

    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        value: match[0],
        index: match.index,
      });

      /*
       * Prevent infinite loops for
       * zero-length matches.
       */
      if (match[0] === "") {
        regex.lastIndex += 1;
      }
    }

    return {
      valid: true,
      matches,
      error: null,
    };
  } catch (error) {
    return {
      valid: false,
      matches: [],
      error:
        error instanceof Error
          ? error.message
          : "Invalid regular expression.",
    };
  }
}

export function validateRegex(
  pattern: string,
  options: RegexOptions = {}
): {
  valid: boolean;
  error: string | null;
} {
  try {
    buildRegex(pattern, options);

    return {
      valid: true,
      error: null,
    };
  } catch (error) {
    return {
      valid: false,
      error:
        error instanceof Error
          ? error.message
          : "Invalid regular expression.",
    };
  }
}