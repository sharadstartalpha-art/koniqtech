"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      error,
      leftIcon,
      rightIcon,
      loading = false,
      fullWidth = true,
      className,
      disabled,
      id,
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
            className="block text-sm font-medium text-slate-700"
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

          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled || loading}
            className={cn(
  "h-11 w-full rounded-xl border bg-white px-4 text-sm shadow-sm outline-none transition-all",
  "placeholder:text-slate-400",
  "focus:ring-4",

  !!leftIcon && "pl-11",

  !!(rightIcon || loading) && "pr-11",

  error
    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
    : "border-slate-300 focus:border-blue-500 focus:ring-blue-100",

  className
)}
            {...props}
          />

          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            </div>
          )}

          {!loading && rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}

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

Input.displayName = "Input";

export default Input;