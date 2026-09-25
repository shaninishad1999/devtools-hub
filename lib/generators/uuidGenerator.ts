export type UUIDVersion =
  | "v1"
  | "v2"
  | "v3"
  | "v4"
  | "v5"
  | "v6"
  | "v7"
  | "v8";

export interface UUIDOptions {
  version: UUIDVersion;
  namespace?: string;
  name?: string;
  customFormat?: string;
}

const HEX = "0123456789abcdef";

const UINT32_MAX_PLUS_ONE = 0x100000000;

// UUID epoch: 1582-10-15 to 1970-01-01 in 100ns intervals.
const UUID_EPOCH_HIGH = 0x01b21dd2;
const UUID_EPOCH_LOW = 0x13814000;

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function formatUUID(hex: string): string {
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

function setVersionAndVariant(
  bytes: Uint8Array,
  version: number
): void {
  bytes[6] =
    (bytes[6] & 0x0f) |
    (version << 4);

  bytes[8] =
    (bytes[8] & 0x3f) |
    0x80;
}

/* -------------------------------------------------- */
/* UUID v4                                            */
/* -------------------------------------------------- */

export function generateV4(): string {
  const bytes = randomBytes(16);

  setVersionAndVariant(bytes, 4);

  return formatUUID(bytesToHex(bytes));
}

/* -------------------------------------------------- */
/* UUID v8                                            */
/* -------------------------------------------------- */

export function generateV8(): string {
  const bytes = randomBytes(16);

  setVersionAndVariant(bytes, 8);

  return formatUUID(bytesToHex(bytes));
}

/* -------------------------------------------------- */
/* UUID v7                                            */
/* -------------------------------------------------- */

export function generateV7(): string {
  const bytes = randomBytes(16);

  const timestamp = Date.now();

  // UUID v7 uses a 48-bit Unix timestamp.
  const high =
    Math.floor(timestamp / UINT32_MAX_PLUS_ONE);

  const low =
    timestamp >>> 0;

  bytes[0] = (high >>> 8) & 0xff;
  bytes[1] = high & 0xff;

  bytes[2] = (low >>> 24) & 0xff;
  bytes[3] = (low >>> 16) & 0xff;
  bytes[4] = (low >>> 8) & 0xff;
  bytes[5] = low & 0xff;

  setVersionAndVariant(bytes, 7);

  return formatUUID(bytesToHex(bytes));
}

/* -------------------------------------------------- */
/* UUID timestamp without BigInt                     */
/* -------------------------------------------------- */

function getUUIDTimestampParts(): {
  high: number;
  low: number;
} {
  const milliseconds = Date.now();

  /*
   * milliseconds * 10000 can exceed JavaScript's
   * safe integer range, so calculate the value
   * using separate 32-bit parts.
   */

  const msHigh = Math.floor(
    milliseconds / UINT32_MAX_PLUS_ONE
  );

  const msLow =
    milliseconds >>> 0;

  const lowProduct =
    msLow * 10000;

  const lowPart =
    lowProduct >>> 0;

  const carry =
    Math.floor(
      lowProduct / UINT32_MAX_PLUS_ONE
    );

  const highProduct =
    msHigh * 10000;

  const lowWithEpoch =
    lowPart + UUID_EPOCH_LOW;

  const low =
    lowWithEpoch >>> 0;

  const epochCarry =
    Math.floor(
      lowWithEpoch / UINT32_MAX_PLUS_ONE
    );

  const high =
    (
      UUID_EPOCH_HIGH +
      highProduct +
      carry +
      epochCarry
    ) >>> 0;

  return {
    high,
    low,
  };
}

/* -------------------------------------------------- */
/* Random node                                        */
/* -------------------------------------------------- */

function getRandomNode(): Uint8Array {
  const node = randomBytes(6);

  // Locally administered + multicast bits.
  node[0] |= 0x03;

  return node;
}

/* -------------------------------------------------- */
/* UUID v1                                            */
/* -------------------------------------------------- */

export function generateV1(): string {
  const timestamp =
    getUUIDTimestampParts();

  const bytes =
    new Uint8Array(16);

  /*
   * UUID v1 timestamp is 60 bits:
   *
   * time_low  = lower 32 bits
   * time_mid  = next 16 bits
   * time_high = upper 12 bits
   */

  const timeLow =
    timestamp.low;

  const timeMid =
    (timestamp.high >>> 16) & 0xffff;

  const timeHigh =
    timestamp.high & 0x0fff;

  bytes[0] =
    (timeLow >>> 24) & 0xff;

  bytes[1] =
    (timeLow >>> 16) & 0xff;

  bytes[2] =
    (timeLow >>> 8) & 0xff;

  bytes[3] =
    timeLow & 0xff;

  bytes[4] =
    (timeMid >>> 8) & 0xff;

  bytes[5] =
    timeMid & 0xff;

  bytes[6] =
    ((timeHigh >>> 8) & 0x0f) |
    0x10;

  bytes[7] =
    timeHigh & 0xff;

  const clockSeq =
    Math.floor(
      Math.random() * 0x4000
    );

  bytes[8] =
    ((clockSeq >>> 8) & 0x3f) |
    0x80;

  bytes[9] =
    clockSeq & 0xff;

  const node =
    getRandomNode();

  bytes.set(node, 10);

  return formatUUID(
    bytesToHex(bytes)
  );
}

/* -------------------------------------------------- */
/* UUID v6                                            */
/* -------------------------------------------------- */

export function generateV6(): string {
  const timestamp =
    getUUIDTimestampParts();

  const bytes =
    new Uint8Array(16);

  /*
   * Reordered timestamp layout.
   */

  const timestampHigh =
    timestamp.high;

  const timestampLow =
    timestamp.low;

  bytes[0] =
    (timestampHigh >>> 20) & 0xff;

  bytes[1] =
    (timestampHigh >>> 12) & 0xff;

  bytes[2] =
    (timestampHigh >>> 4) & 0xff;

  bytes[3] =
    ((timestampHigh & 0x0f) << 4) |
    ((timestampLow >>> 28) & 0x0f);

  bytes[4] =
    (timestampLow >>> 20) & 0xff;

  bytes[5] =
    (timestampLow >>> 12) & 0xff;

  bytes[6] =
    0x60 |
    ((timestampLow >>> 8) & 0x0f);

  bytes[7] =
    timestampLow & 0xff;

  const random =
    randomBytes(8);

  bytes[8] =
    (random[0] & 0x3f) |
    0x80;

  for (let i = 9; i < 16; i++) {
    bytes[i] =
      random[i - 1];
  }

  return formatUUID(
    bytesToHex(bytes)
  );
}

/* -------------------------------------------------- */
/* UUID namespace parser                              */
/* -------------------------------------------------- */

function parseUUID(
  uuid: string
): Uint8Array {
  const clean =
    uuid.replace(/-/g, "");

  if (
    !/^[0-9a-fA-F]{32}$/.test(clean)
  ) {
    throw new Error(
      "Invalid namespace UUID."
    );
  }

  const bytes =
    new Uint8Array(16);

  for (let i = 0; i < 16; i++) {
    bytes[i] =
      parseInt(
        clean.slice(
          i * 2,
          i * 2 + 2
        ),
        16
      );
  }

  return bytes;
}

/* -------------------------------------------------- */
/* SHA-1                                              */
/* -------------------------------------------------- */

async function sha1(
  data: Uint8Array
): Promise<Uint8Array> {
  /*
   * Create a real ArrayBuffer.
   *
   * This avoids the TypeScript:
   *
   * Uint8Array<ArrayBufferLike>
   * is not assignable to BufferSource
   *
   * error in newer TypeScript/lib.dom versions.
   */

  const buffer =
    new ArrayBuffer(data.byteLength);

  const view =
    new Uint8Array(buffer);

  view.set(data);

  const digest =
    await crypto.subtle.digest(
      "SHA-1",
      buffer
    );

  return new Uint8Array(digest);
}

/* -------------------------------------------------- */
/* MD5                                                */
/* -------------------------------------------------- */

function md5(
  input: Uint8Array
): Uint8Array {
  const data =
    Array.from(input);

  const bitLengthLow =
    (data.length * 8) >>> 0;

  const bitLengthHigh =
    Math.floor(
      (data.length * 8) /
        UINT32_MAX_PLUS_ONE
    );

  data.push(0x80);

  while (
    data.length % 64 !== 56
  ) {
    data.push(0);
  }

  data.push(
    bitLengthLow & 0xff,
    (bitLengthLow >>> 8) & 0xff,
    (bitLengthLow >>> 16) & 0xff,
    (bitLengthLow >>> 24) & 0xff,

    bitLengthHigh & 0xff,
    (bitLengthHigh >>> 8) & 0xff,
    (bitLengthHigh >>> 16) & 0xff,
    (bitLengthHigh >>> 24) & 0xff
  );

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  const s = [
    7, 12, 17, 22,
    7, 12, 17, 22,
    7, 12, 17, 22,
    7, 12, 17, 22,

    5, 9, 14, 20,
    5, 9, 14, 20,
    5, 9, 14, 20,
    5, 9, 14, 20,

    4, 11, 16, 23,
    4, 11, 16, 23,
    4, 11, 16, 23,
    4, 11, 16, 23,

    6, 10, 15, 21,
    6, 10, 15, 21,
    6, 10, 15, 21,
    6, 10, 15, 21,
  ];

  const k =
    Array.from(
      { length: 64 },
      (_, i) =>
        Math.floor(
          Math.abs(
            Math.sin(i + 1)
          ) *
            0x100000000
        ) >>> 0
    );

  const leftRotate = (
    value: number,
    amount: number
  ) =>
    (
      (value << amount) |
      (value >>> (32 - amount))
    ) >>> 0;

  for (
    let offset = 0;
    offset < data.length;
    offset += 64
  ) {
    const m =
      new Uint32Array(16);

    for (let i = 0; i < 16; i++) {
      m[i] =
        data[offset + i * 4] |
        (data[offset + i * 4 + 1] << 8) |
        (data[offset + i * 4 + 2] << 16) |
        (data[offset + i * 4 + 3] << 24);
    }

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let i = 0; i < 64; i++) {
      let f: number;
      let g: number;

      if (i < 16) {
        f =
          (b & c) |
          (~b & d);

        g = i;
      } else if (i < 32) {
        f =
          (d & b) |
          (~d & c);

        g =
          (5 * i + 1) % 16;
      } else if (i < 48) {
        f =
          b ^ c ^ d;

        g =
          (3 * i + 5) % 16;
      } else {
        f =
          c ^
          (b | ~d);

        g =
          (7 * i) % 16;
      }

      const temp = d;

      d = c;
      c = b;

      const sum =
        (
          a +
          f +
          k[i] +
          m[g]
        ) >>> 0;

      b =
        (
          b +
          leftRotate(
            sum,
            s[i]
          )
        ) >>> 0;

      a = temp;
    }

    a0 =
      (a0 + a) >>> 0;

    b0 =
      (b0 + b) >>> 0;

    c0 =
      (c0 + c) >>> 0;

    d0 =
      (d0 + d) >>> 0;
  }

  const result =
    new Uint8Array(16);

  const words = [
    a0,
    b0,
    c0,
    d0,
  ];

  for (let i = 0; i < 4; i++) {
    result[i * 4] =
      words[i] & 0xff;

    result[i * 4 + 1] =
      (words[i] >>> 8) & 0xff;

    result[i * 4 + 2] =
      (words[i] >>> 16) & 0xff;

    result[i * 4 + 3] =
      (words[i] >>> 24) & 0xff;
  }

  return result;
}

/* -------------------------------------------------- */
/* UUID bits                                          */
/* -------------------------------------------------- */

function applyUUIDBits(
  bytes: Uint8Array,
  version: number
): void {
  bytes[6] =
    (bytes[6] & 0x0f) |
    (version << 4);

  bytes[8] =
    (bytes[8] & 0x3f) |
    0x80;
}

/* -------------------------------------------------- */
/* UUID v3                                            */
/* -------------------------------------------------- */

export async function generateV3(
  namespace: string,
  name: string
): Promise<string> {
  const namespaceBytes =
    parseUUID(namespace);

  const nameBytes =
    new TextEncoder().encode(name);

  const combined =
    new Uint8Array(
      namespaceBytes.length +
        nameBytes.length
    );

  combined.set(
    namespaceBytes
  );

  combined.set(
    nameBytes,
    namespaceBytes.length
  );

  const hash =
    md5(combined);

  applyUUIDBits(
    hash,
    3
  );

  return formatUUID(
    bytesToHex(hash)
  );
}

/* -------------------------------------------------- */
/* UUID v5                                            */
/* -------------------------------------------------- */

export async function generateV5(
  namespace: string,
  name: string
): Promise<string> {
  const namespaceBytes =
    parseUUID(namespace);

  const nameBytes =
    new TextEncoder().encode(name);

  const combined =
    new Uint8Array(
      namespaceBytes.length +
        nameBytes.length
    );

  combined.set(
    namespaceBytes
  );

  combined.set(
    nameBytes,
    namespaceBytes.length
  );

  const hash =
    await sha1(combined);

  const result =
    hash.slice(0, 16);

  applyUUIDBits(
    result,
    5
  );

  return formatUUID(
    bytesToHex(result)
  );
}

/* -------------------------------------------------- */
/* UUID v2                                            */
/* -------------------------------------------------- */

export function generateV2(): string {
  const base =
    generateV1()
      .replace(/-/g, "");

  const bytes =
    new Uint8Array(16);

  for (let i = 0; i < 16; i++) {
    bytes[i] =
      parseInt(
        base.slice(
          i * 2,
          i * 2 + 2
        ),
        16
      );
  }

  applyUUIDBits(
    bytes,
    2
  );

  return formatUUID(
    bytesToHex(bytes)
  );
}

/* -------------------------------------------------- */
/* Custom UUID v8                                    */
/* -------------------------------------------------- */

export function generateCustomUUID(
  format: string
): string {
  const normalized =
    format.trim();

  if (!normalized) {
    return generateV8();
  }

  const clean =
    normalized.replace(/-/g, "");

  if (clean.length !== 32) {
    throw new Error(
      "Custom UUID format must contain exactly 32 characters."
    );
  }

  let output = "";

  for (
    let i = 0;
    i < clean.length;
    i++
  ) {
    const char =
      clean[i];

    if (
      char === "x" ||
      char === "X"
    ) {
      output +=
        HEX[
          Math.floor(
            Math.random() * 16
          )
        ];
    } else if (
      char === "y" ||
      char === "Y"
    ) {
      const variants = [
        "8",
        "9",
        "a",
        "b",
      ];

      output +=
        variants[
          Math.floor(
            Math.random() *
              variants.length
          )
        ];
    } else {
      output += char;
    }
  }

  if (
    !/^[0-9a-fA-F]{32}$/.test(
      output
    )
  ) {
    throw new Error(
      "Invalid custom UUID format. Use x for random hex, y for variant and 8 for UUID v8."
    );
  }

  return formatUUID(output);
}

/* -------------------------------------------------- */
/* Main UUID Generator                                */
/* -------------------------------------------------- */

export async function generateUUID(
  options: UUIDOptions
): Promise<string> {
  switch (options.version) {
    case "v1":
      return generateV1();

    case "v2":
      return generateV2();

    case "v3":
      return generateV3(
        options.namespace || "",
        options.name || ""
      );

    case "v4":
      return generateV4();

    case "v5":
      return generateV5(
        options.namespace || "",
        options.name || ""
      );

    case "v6":
      return generateV6();

    case "v7":
      return generateV7();

    case "v8":
      return generateCustomUUID(
        options.customFormat ||
          "xxxxxxxx-xxxx-8xxx-yxxx-xxxxxxxxxxxx"
      );

    default:
      return generateV4();
  }
}