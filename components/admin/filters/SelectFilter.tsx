"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFilterProps {
  label?: string;

  value: string;

  options: SelectOption[];

  onChange: (value: string) => void;

  placeholder?: string;

  disabled?: boolean;

  className?: string;

  fullWidth?: boolean;
}

export default function SelectFilter({
  label,
  value,
  options,
  onChange,
  placeholder = "Select",
  disabled = false,
  className,
  fullWidth = true,
}: SelectFilterProps) {
  return (
    <div
      className={cn(
        "space-y-2",
        fullWidth && "w-full",
        className
      )}
    >
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">

        <select
          value={value}
          disabled={disabled}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="
            h-12
            w-full
            appearance-none
            rounded-xl
            border
            border-slate-300
            bg-white
            px-4
            pr-10
            text-sm
            shadow-sm
            outline-none
            transition
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100
            disabled:cursor-not-allowed
            disabled:bg-slate-100
            disabled:opacity-60
          "
        >
          <option value="">
            {placeholder}
          </option>

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            h-5
            w-5
            -translate-y-1/2
            text-slate-400
          "
        />

      </div>
    </div>
  );
}