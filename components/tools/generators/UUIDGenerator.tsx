"use client";

import {
  ChangeEvent,
  useRef,
  useState,
} from "react";

import {
  generateUUID,
  UUIDVersion,
} from "@/lib/generators/uuidGenerator";

interface UUIDGeneratorProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

type ToastType = "success" | "error" | "info";

interface ToastState {
  message: string;
  type: ToastType;
}

const DEFAULT_NAMESPACE =
  "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

const DEFAULT_CUSTOM_FORMAT =
  "xxxxxxxx-xxxx-8xxx-yxxx-xxxxxxxxxxxx";

function formatVersionLabel(
  version: UUIDVersion
): string {
  switch (version) {
    case "v1":
      return "UUID v1 — Time-based";

    case "v2":
      return "UUID v2 — DCE Security";

    case "v3":
      return "UUID v3 — MD5 Name-based";

    case "v4":
      return "UUID v4 — Random";

    case "v5":
      return "UUID v5 — SHA-1 Name-based";

    case "v6":
      return "UUID v6 — Reordered Time";

    case "v7":
      return "UUID v7 — Unix Time";

    case "v8":
      return "UUID v8 — Custom";

    default:
      return version;
  }
}

function getVersionDescription(
  version: UUIDVersion
): string {
  switch (version) {
    case "v1":
      return "Time-based UUID.";

    case "v2":
      return "DCE Security / legacy UUID.";

    case "v3":
      return "Name-based UUID using MD5.";

    case "v4":
      return "Random UUID.";

    case "v5":
      return "Name-based UUID using SHA-1.";

    case "v6":
      return "Reordered time-based UUID.";

    case "v7":
      return "Unix timestamp + random UUID.";

    case "v8":
      return "Custom UUID format.";

    default:
      return "";
  }
}

export default function UUIDGenerator({
  theme,
  onToggleTheme,
}: UUIDGeneratorProps) {
  const isDark = theme === "dark";

  const customFormatRef =
    useRef<HTMLInputElement>(null);

  const toastTimerRef =
    useRef<number | null>(null);

  const [version, setVersion] =
    useState<UUIDVersion>("v4");

  const [quantity, setQuantity] =
    useState(5);

  const [namespace, setNamespace] =
    useState(DEFAULT_NAMESPACE);

  const [name, setName] =
    useState("");

  const [customFormat, setCustomFormat] =
    useState(DEFAULT_CUSTOM_FORMAT);

  const [uuids, setUUIDs] =
    useState<string[]>([]);

  const [error, setError] =
    useState("");

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [toast, setToast] =
    useState<ToastState | null>(null);

  const showToast = (
    message: string,
    type: ToastType = "success"
  ) => {
    if (toastTimerRef.current) {
      window.clearTimeout(
        toastTimerRef.current
      );
    }

    setToast({
      message,
      type,
    });

    toastTimerRef.current =
      window.setTimeout(() => {
        setToast(null);
      }, 3000);
  };

  const closeToast = () => {
    if (toastTimerRef.current) {
      window.clearTimeout(
        toastTimerRef.current
      );
    }

    setToast(null);
  };

  const handleGenerate = async () => {
    setError("");
    setIsGenerating(true);

    try {
      const safeQuantity = Math.min(
        1000,
        Math.max(
          1,
          Number(quantity) || 1
        )
      );

      const generated: string[] = [];

      for (
        let i = 0;
        i < safeQuantity;
        i++
      ) {
        const uuid =
          await generateUUID({
            version,
            namespace,
            name:
              name ||
              `uuid-${Date.now()}-${i}`,
            customFormat,
          });

        generated.push(uuid);
      }

      setUUIDs(generated);

      showToast(
        `${generated.length} UUID${
          generated.length === 1
            ? ""
            : "s"
        } generated successfully`,
        "success"
      );
    } catch (err) {
      setUUIDs([]);

      const message =
        err instanceof Error
          ? err.message
          : "Unable to generate UUIDs.";

      setError(message);

      showToast(
        message,
        "error"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const copyUUID = async (
    uuid: string
  ) => {
    try {
      await navigator.clipboard.writeText(
        uuid
      );

      showToast(
        "UUID copied to clipboard",
        "success"
      );
    } catch {
      setError(
        "Unable to copy UUID."
      );

      showToast(
        "Unable to copy UUID",
        "error"
      );
    }
  };

  const copyAll = async () => {
    if (!uuids.length) {
      showToast(
        "No UUIDs available to copy",
        "info"
      );

      return;
    }

    try {
      await navigator.clipboard.writeText(
        uuids.join("\n")
      );

      showToast(
        "All UUIDs copied to clipboard",
        "success"
      );
    } catch {
      setError(
        "Unable to copy UUIDs."
      );

      showToast(
        "Unable to copy UUIDs",
        "error"
      );
    }
  };

  const downloadAll = () => {
    if (!uuids.length) {
      showToast(
        "No UUIDs available to download",
        "info"
      );

      return;
    }

    try {
      const blob = new Blob(
        [uuids.join("\n")],
        {
          type:
            "text/plain;charset=utf-8",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const anchor =
        document.createElement("a");

      anchor.href = url;
      anchor.download =
        "generated-uuids.txt";

      document.body.appendChild(
        anchor
      );

      anchor.click();

      anchor.remove();

      URL.revokeObjectURL(url);

      showToast(
        "UUIDs downloaded successfully",
        "success"
      );
    } catch {
      setError(
        "Unable to download UUIDs."
      );

      showToast(
        "Unable to download UUIDs",
        "error"
      );
    }
  };

  const handleClear = () => {
    setUUIDs([]);
    setError("");

    showToast(
      "Generated UUIDs cleared",
      "success"
    );
  };

  const handleCustomUpload = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = () => {
      const content =
        String(
          reader.result || ""
        ).trim();

      if (!content) {
        setError(
          "The uploaded format file is empty."
        );

        showToast(
          "Uploaded format file is empty",
          "error"
        );

        return;
      }

      setCustomFormat(content);
      setError("");

      showToast(
        "Custom UUID format uploaded",
        "success"
      );
    };

    reader.onerror = () => {
      setError(
        "Unable to read the format file."
      );

      showToast(
        "Unable to read format file",
        "error"
      );
    };

    reader.readAsText(file);

    event.target.value = "";
  };

  const getToastClasses = () => {
    if (!toast) return "";

    if (toast.type === "success") {
      return isDark
        ? "border-emerald-700 bg-emerald-950 text-emerald-200"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (toast.type === "error") {
      return isDark
        ? "border-red-700 bg-red-950 text-red-200"
        : "border-red-200 bg-red-50 text-red-700";
    }

    return isDark
      ? "border-blue-700 bg-blue-950 text-blue-200"
      : "border-blue-200 bg-blue-50 text-blue-700";
  };

  const getToastIcon = () => {
    if (!toast) return "";

    if (toast.type === "success") {
      return "✓";
    }

    if (toast.type === "error") {
      return "!";
    }

    return "i";
  };

  return (
    <div className="relative w-full">

      {/* Toast */}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`
            fixed
            right-4
            top-4
            z-[100]
            flex
            max-w-sm
            items-start
            gap-3
            rounded-xl
            border
            px-4
            py-3
            text-sm
            font-medium
            shadow-lg
            ${getToastClasses()}
          `}
        >
          <span
            className={`
              flex
              h-5
              w-5
              shrink-0
              items-center
              justify-center
              rounded-full
              text-xs
              font-bold
              ${
                toast.type === "success"
                  ? "bg-emerald-500 text-white"
                  : toast.type === "error"
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white"
              }
            `}
          >
            {getToastIcon()}
          </span>

          <span className="flex-1 leading-5">
            {toast.message}
          </span>

          <button
            type="button"
            onClick={closeToast}
            aria-label="Close notification"
            className="
              shrink-0
              cursor-pointer
              text-lg
              leading-none
              opacity-60
              transition
              hover:opacity-100
            "
          >
            ×
          </button>
        </div>
      )}

      {/* Action Row */}

      <div className="mt-6 flex flex-wrap items-center gap-3">

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`
            cursor-pointer
            rounded-xl
            px-5
            py-2.5
            text-sm
            font-medium
            shadow-sm
            transition
            disabled:cursor-not-allowed
            disabled:opacity-50
            ${
              isDark
                ? "bg-white text-black hover:bg-zinc-200"
                : "bg-zinc-900 text-white hover:bg-zinc-800"
            }
          `}
        >
          {isGenerating
            ? "Generating..."
            : "Generate UUIDs"}
        </button>

        <button
          type="button"
          onClick={copyAll}
          disabled={!uuids.length}
          className={`
            cursor-pointer
            rounded-xl
            border
            px-5
            py-2.5
            text-sm
            font-medium
            shadow-sm
            transition
            disabled:cursor-not-allowed
            disabled:opacity-40
            ${
              isDark
                ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
            }
          `}
        >
          Copy All
        </button>

        <button
          type="button"
          onClick={downloadAll}
          disabled={!uuids.length}
          className={`
            cursor-pointer
            rounded-xl
            border
            px-5
            py-2.5
            text-sm
            font-medium
            shadow-sm
            transition
            disabled:cursor-not-allowed
            disabled:opacity-40
            ${
              isDark
                ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
            }
          `}
        >
          Download All
        </button>

        <button
          type="button"
          onClick={handleClear}
          className={`
            cursor-pointer
            rounded-xl
            border
            px-5
            py-2.5
            text-sm
            font-medium
            shadow-sm
            transition
            ${
              isDark
                ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
            }
          `}
        >
          Clear
        </button>

        
      </div>

      {/* Configuration */}

      <div
        className={`
          mt-6
          rounded-2xl
          border
          p-5
          shadow-sm
          ${
            isDark
              ? "border-zinc-800 bg-zinc-900"
              : "border-zinc-200 bg-white"
          }
        `}
      >
        <div className="grid gap-5 md:grid-cols-2">

          {/* UUID Version */}

          <div>
            <label
              className={`
                mb-2
                block
                text-sm
                font-medium
                ${
                  isDark
                    ? "text-zinc-200"
                    : "text-zinc-800"
                }
              `}
            >
              UUID Version
            </label>

            <select
              value={version}
              onChange={(event) =>
                setVersion(
                  event.target
                    .value as UUIDVersion
                )
              }
              className={`
                w-full
                rounded-xl
                border
                px-4
                py-3
                text-sm
                outline-none
                transition
                ${
                  isDark
                    ? "border-zinc-700 bg-zinc-950 text-zinc-100 focus:border-zinc-500"
                    : "border-zinc-300 bg-white text-zinc-900 focus:border-zinc-500"
                }
              `}
            >
              {(
                [
                  "v1",
                  "v2",
                  "v3",
                  "v4",
                  "v5",
                  "v6",
                  "v7",
                  "v8",
                ] as UUIDVersion[]
              ).map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {formatVersionLabel(
                    item
                  )}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-zinc-500">
              {getVersionDescription(
                version
              )}
            </p>
          </div>

          {/* Quantity */}

          <div>
            <label
              className={`
                mb-2
                block
                text-sm
                font-medium
                ${
                  isDark
                    ? "text-zinc-200"
                    : "text-zinc-800"
                }
              `}
            >
              Quantity
            </label>

            <input
              type="number"
              min={1}
              max={1000}
              value={quantity}
              onChange={(event) =>
                setQuantity(
                  Math.min(
                    1000,
                    Math.max(
                      1,
                      Number(
                        event.target.value
                      ) || 1
                    )
                  )
                )
              }
              className={`
                w-full
                rounded-xl
                border
                px-4
                py-3
                text-sm
                outline-none
                ${
                  isDark
                    ? "border-zinc-700 bg-zinc-950 text-zinc-100"
                    : "border-zinc-300 bg-white text-zinc-900"
                }
              `}
            />

            <p className="mt-2 text-xs text-zinc-500">
              Generate up to 1000 UUIDs.
            </p>
          </div>
        </div>

        {/* v3 / v5 */}

        {(version === "v3" ||
          version === "v5") && (
          <div className="mt-5 grid gap-5 md:grid-cols-2">

            <div>
              <label
                className={`
                  mb-2
                  block
                  text-sm
                  font-medium
                  ${
                    isDark
                      ? "text-zinc-200"
                      : "text-zinc-800"
                  }
                `}
              >
                Namespace UUID
              </label>

              <input
                value={namespace}
                onChange={(event) =>
                  setNamespace(
                    event.target.value
                  )
                }
                placeholder={
                  DEFAULT_NAMESPACE
                }
                className={`
                  w-full
                  rounded-xl
                  border
                  px-4
                  py-3
                  font-mono
                  text-sm
                  outline-none
                  ${
                    isDark
                      ? "border-zinc-700 bg-zinc-950 text-zinc-100"
                      : "border-zinc-300 bg-white text-zinc-900"
                  }
                `}
              />
            </div>

            <div>
              <label
                className={`
                  mb-2
                  block
                  text-sm
                  font-medium
                  ${
                    isDark
                      ? "text-zinc-200"
                      : "text-zinc-800"
                  }
                `}
              >
                Name
              </label>

              <input
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="example.com"
                className={`
                  w-full
                  rounded-xl
                  border
                  px-4
                  py-3
                  text-sm
                  outline-none
                  ${
                    isDark
                      ? "border-zinc-700 bg-zinc-950 text-zinc-100"
                      : "border-zinc-300 bg-white text-zinc-900"
                  }
                `}
              />
            </div>

          </div>
        )}

        {/* Custom v8 */}

        {version === "v8" && (
          <div className="mt-5">

            <label
              className={`
                mb-2
                block
                text-sm
                font-medium
                ${
                  isDark
                    ? "text-zinc-200"
                    : "text-zinc-800"
                }
              `}
            >
              Custom UUID Format
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">

              <input
                value={customFormat}
                onChange={(event) =>
                  setCustomFormat(
                    event.target.value
                  )
                }
                placeholder={
                  DEFAULT_CUSTOM_FORMAT
                }
                className={`
                  min-w-0
                  flex-1
                  rounded-xl
                  border
                  px-4
                  py-3
                  font-mono
                  text-sm
                  outline-none
                  ${
                    isDark
                      ? "border-zinc-700 bg-zinc-950 text-zinc-100"
                      : "border-zinc-300 bg-white text-zinc-900"
                  }
                `}
              />

              <input
                ref={customFormatRef}
                type="file"
                accept=".txt,.json,.text"
                className="hidden"
                onChange={
                  handleCustomUpload
                }
              />

              <button
                type="button"
                onClick={() =>
                  customFormatRef.current?.click()
                }
                className={`
                  cursor-pointer
                  rounded-xl
                  border
                  px-5
                  py-3
                  text-sm
                  font-medium
                  transition
                  ${
                    isDark
                      ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                      : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
                  }
                `}
              >
                Upload Format
              </button>
            </div>

            <p className="mt-2 text-xs text-zinc-500">
              Use <b>x</b> for random hex,
              <b> y</b> for UUID variant,
              and <b>8</b> for UUID v8.
            </p>
          </div>
        )}

        {/* Error */}

        {error && (
          <div
            className={`
              mt-5
              rounded-xl
              border
              px-4
              py-3
              text-sm
              ${
                isDark
                  ? "border-red-900/60 bg-red-950/30 text-red-300"
                  : "border-red-200 bg-red-50 text-red-700"
              }
            `}
          >
            {error}
          </div>
        )}
      </div>

      {/* Generated UUIDs */}

      <div className="mt-8">

        <div
          className="
            mb-4
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
          "
        >
          <h2
            className={`
              text-lg
              font-semibold
              ${
                isDark
                  ? "text-white"
                  : "text-zinc-900"
              }
            `}
          >
            Generated UUIDs
          </h2>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={copyAll}
              disabled={!uuids.length}
              className={`
                cursor-pointer
                rounded-lg
                border
                px-3
                py-2
                text-xs
                font-medium
                transition
                disabled:cursor-not-allowed
                disabled:opacity-40
                ${
                  isDark
                    ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                    : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
                }
              `}
            >
              Copy All
            </button>

            <button
              type="button"
              onClick={downloadAll}
              disabled={!uuids.length}
              className={`
                cursor-pointer
                rounded-lg
                border
                px-3
                py-2
                text-xs
                font-medium
                transition
                disabled:cursor-not-allowed
                disabled:opacity-40
                ${
                  isDark
                    ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                    : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100"
                }
              `}
            >
              Download All
            </button>

          </div>
        </div>

        {uuids.length === 0 ? (
          <div
            className={`
              rounded-2xl
              border
              p-8
              text-center
              text-sm
              ${
                isDark
                  ? "border-zinc-800 bg-zinc-900 text-zinc-500"
                  : "border-zinc-200 bg-white text-zinc-500"
              }
            `}
          >
            No UUIDs generated yet.
          </div>
        ) : (
          <div
            className={`
              overflow-hidden
              rounded-2xl
              border
              ${
                isDark
                  ? "border-zinc-800 bg-zinc-900"
                  : "border-zinc-200 bg-white"
              }
            `}
          >
            <div className="divide-y divide-zinc-800/20">

              {uuids.map(
                (uuid, index) => (
                  <div
                    key={`${uuid}-${index}`}
                    className={`
                      flex
                      items-center
                      justify-between
                      gap-4
                      px-4
                      py-3
                      ${
                        isDark
                          ? "hover:bg-zinc-800/50"
                          : "hover:bg-zinc-50"
                      }
                    `}
                  >
                    <code
                      className={`
                        min-w-0
                        break-all
                        font-mono
                        text-sm
                        ${
                          isDark
                            ? "text-zinc-200"
                            : "text-zinc-800"
                        }
                      `}
                    >
                      {uuid}
                    </code>

                    <button
                      type="button"
                      onClick={() =>
                        copyUUID(uuid)
                      }
                      className={`
                        shrink-0
                        cursor-pointer
                        rounded-lg
                        border
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        transition
                        ${
                          isDark
                            ? "border-zinc-700 bg-zinc-950 text-zinc-200 hover:bg-zinc-800"
                            : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                        }
                      `}
                    >
                      Copy
                    </button>
                  </div>
                )
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}