"use client";

import {
  forwardRef,
  InputHTMLAttributes,
} from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import FormField from "./FormField";

export interface SwitchProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "size"
  > {
  label?: string;

  description?: string;

  error?: string;

  loading?: boolean;

  required?: boolean;

  optional?: boolean;

  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: {
    track: "h-5 w-9",
    thumb: "h-4 w-4",
    translate: "peer-checked:translate-x-4",
  },

  md: {
    track: "h-6 w-11",
    thumb: "h-5 w-5",
    translate: "peer-checked:translate-x-5",
  },

  lg: {
    track: "h-7 w-14",
    thumb: "h-6 w-6",
    translate: "peer-checked:translate-x-7",
  },
};

const Switch = forwardRef<
  HTMLInputElement,
  SwitchProps
>(
  (
    {
      id,
      label,
      description,
      error,
      loading = false,
      required,
      optional,
      size = "md",
      className,
      disabled,
      checked,
      ...props
    },
    ref
  ) => {
    const s = sizes[size];

    return (
      <FormField
        id={id}
        label={label}
        description={description}
        error={error}
        required={required}
        optional={optional}
      >
        <label
          className={cn(
            "inline-flex cursor-pointer items-center gap-4",
            (disabled || loading) &&
              "cursor-not-allowed opacity-60"
          )}
        >
          <div className="relative">

            <input
              {...props}
              ref={ref}
              id={id}
              type="checkbox"
              checked={checked}
              disabled={disabled || loading}
              className="peer sr-only"
            />

            <div
              className={cn(
                "rounded-full bg-slate-300 transition-all duration-300",

                s.track,

                "peer-checked:bg-blue-600",

                "peer-focus:ring-4 peer-focus:ring-blue-100"
              )}
            />

            <div
              className={cn(
                "absolute left-0.5 top-1/2 -translate-y-1/2 rounded-full bg-white shadow transition-transform duration-300",

                s.thumb,

                s.translate
              )}
            >
              {loading && (
                <div className="flex h-full w-full items-center justify-center">
                  <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                </div>
              )}
            </div>

          </div>

          <span
            className={cn(
              "text-sm font-medium",

              checked
                ? "text-slate-900"
                : "text-slate-500"
            )}
          >
            {checked ? "Enabled" : "Disabled"}
          </span>

        </label>
      </FormField>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;