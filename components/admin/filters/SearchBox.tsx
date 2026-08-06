"use client";

import { Search, X } from "lucide-react";

interface SearchBoxProps {
  value: string;

  onChange: (value: string) => void;

  placeholder?: string;

  className?: string;

  disabled?: boolean;

  autoFocus?: boolean;

  loading?: boolean;

  onClear?: () => void;
}

export default function SearchBox({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  disabled = false,
  autoFocus = false,
  loading = false,
  onClear,
}: SearchBoxProps) {
  function handleClear() {
    onChange("");

    onClear?.();
  }

  return (
    <div
      className={`relative w-full ${className}`}
    >
      <Search
        className="
          absolute
          left-4
          top-1/2
          h-5
          w-5
          -translate-y-1/2
          text-slate-400
        "
      />

      <input
        type="text"
        value={value}
        autoFocus={autoFocus}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          h-12
          w-full
          rounded-xl
          border
          border-slate-300
          bg-white
          pl-12
          pr-12
          text-sm
          shadow-sm
          outline-none
          transition-all
          duration-200
          placeholder:text-slate-400
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
          disabled:cursor-not-allowed
          disabled:bg-slate-100
          disabled:opacity-60
        "
      />

      {loading && (
        <div
          className="
            absolute
            right-4
            top-1/2
            h-5
            w-5
            -translate-y-1/2
            animate-spin
            rounded-full
            border-2
            border-blue-600
            border-t-transparent
          "
        />
      )}

      {!loading && value && (
        <button
          type="button"
          onClick={handleClear}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            rounded-full
            p-1
            text-slate-500
            transition
            hover:bg-slate-100
            hover:text-slate-700
          "
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}