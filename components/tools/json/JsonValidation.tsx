"use client";

interface JsonValidationProps {
  valid: boolean;
  error: string | null;
  line: number | null;
  column: number | null;
}

export default function JsonValidation({
  valid,
  error,
  line,
  column,
}: JsonValidationProps) {
  // ================================
  // VALID
  // ================================

  if (valid) {
    return (
      <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/30">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
            ✓
          </div>

          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">
              Valid JSON
            </h3>

            <p className="mt-1 text-sm text-green-700 dark:text-green-400">
              Your JSON is valid and correctly structured.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ================================
  // INVALID
  // ================================

  return (
    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
          !
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-red-800 dark:text-red-300">
            Invalid JSON
          </h3>

          <p className="mt-1 text-sm leading-6 text-red-700 dark:text-red-400">
            {error || "Invalid JSON syntax."}
          </p>

          {line !== null && column !== null && (
            <div className="mt-3 inline-flex rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
              Line {line}, Column {column}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}