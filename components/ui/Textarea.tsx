"use client";

import {
  forwardRef,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";
import {
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;

  description?: string;

  error?: string;

  loading?: boolean;

  fullWidth?: boolean;

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;

  showCount?: boolean;

  maxLength?: number;

  resize?: "none" | "vertical" | "horizontal" | "both";
}

const resizeClasses = {
  none: "resize-none",

  vertical: "resize-y",

  horizontal: "resize-x",

  both: "resize",
};

const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(
  (
    {
      label,
      description,
      error,
      loading = false,
      fullWidth = true,
      leftIcon,
      rightIcon,
      showCount = false,
      resize = "vertical",
      className,
      disabled,
      id,
      value,
      maxLength,
      ...props
    },
    ref
  ) => {
    const count =
      typeof value === "string"
        ? value.length
        : 0;

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
            <div className="pointer-events-none absolute left-3 top-3 text-slate-400">
              {leftIcon}
            </div>
          )}

          <textarea
            ref={ref}
            id={id}
            value={value}
            disabled={disabled || loading}
            maxLength={maxLength}
            className={cn(
              "min-h-[120px] w-full rounded-xl border bg-white px-4 py-3 text-sm shadow-sm outline-none transition-all",
              "placeholder:text-slate-400",
              "focus:ring-4",

              resizeClasses[resize],

                !!leftIcon && "pl-11",

                 !!(rightIcon || loading) && "pr-11",

              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-100",

              (disabled || loading) &&
                "cursor-not-allowed bg-slate-100 opacity-60",

              className
            )}
            {...props}
          />

          {loading && (
            <div className="absolute right-3 top-3">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            </div>
          )}

          {!loading && rightIcon && (
            <div className="absolute right-3 top-3 text-slate-400">
              {rightIcon}
            </div>
          )}

        </div>

        <div className="flex items-center justify-between">

          {error ? (
            <div className="flex items-center gap-2 text-sm text-red-600">

              <AlertCircle className="h-4 w-4 flex-shrink-0" />

              <span>{error}</span>

            </div>
          ) : (
            <div />
          )}

          {showCount && (
            <span
              className={cn(
                "text-xs",
                maxLength &&
                  count >= maxLength
                  ? "text-red-600"
                  : "text-slate-500"
              )}
            >
              {count}
              {maxLength
                ? ` / ${maxLength}`
                : ""}
            </span>
          )}

        </div>

      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;