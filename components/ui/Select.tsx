"use client";

import {
  forwardRef,
  SelectHTMLAttributes,
} from "react";
import {
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    "children"
  > {
  label?: string;

  description?: string;

  error?: string;

  placeholder?: string;

  options: SelectOption[];

  fullWidth?: boolean;

  loading?: boolean;
}

const Select = forwardRef<
  HTMLSelectElement,
  SelectProps
>(
  (
    {
      id,
      label,
      description,
      error,
      placeholder = "Select an option",
      options,
      fullWidth = true,
      loading = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          "space-y-2",
          fullWidth && "w-full"
        )}
      >
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}

        {description && !error && (
          <p className="text-sm text-slate-500">
            {description}
          </p>
        )}

        <div className="relative">

          <select
            ref={ref}
            id={id}
            disabled={disabled || loading}
            className={cn(
              "h-11 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-sm shadow-sm outline-none transition-all",
              "focus:ring-4",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-100",
              (disabled || loading) &&
                "cursor-not-allowed bg-slate-100 opacity-60",
              className
            )}
            {...props}
          >
            <option value="">
              {placeholder}
            </option>

            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
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

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600">

            <AlertCircle className="h-4 w-4 flex-shrink-0" />

            <span>{error}</span>

          </div>
        )}

      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;