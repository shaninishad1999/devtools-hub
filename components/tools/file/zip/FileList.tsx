"use client";

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileList({ files, onRemove }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <ul className="mt-4 divide-y rounded-lg border">
      {files.map((file, index) => (
        <li
          key={`${file.name}-${index}`}
          className="flex items-center justify-between px-4 py-2 text-sm"
        >
          <span className="truncate">{file.name}</span>
          <div className="flex items-center gap-3">
            <span className="text-gray-500">{formatSize(file.size)}</span>
            <button
              onClick={() => onRemove(index)}
              className="text-red-500 hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}