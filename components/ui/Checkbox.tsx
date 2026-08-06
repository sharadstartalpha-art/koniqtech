"use client";

import {
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useRef,
} from "react";
import { Check, Minus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type"
  > {
  label?: string;

  description?: string;

  error?: string;

  loading?: boolean;

  indeterminate?: boolean;
}

const Checkbox = forwardRef<
  HTMLInputElement,
  CheckboxProps
>(
  (
    {
      id,
      label,
      description,
      error,
      loading = false,
      indeterminate = false,
      checked,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const internalRef =
      useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate =
          indeterminate;
      }
    }, [indeterminate]);

    function assignRef(
      element: HTMLInputElement | null
    ) {
      internalRef.current = element;

      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    }

    return (
      <div className="space-y-2">

        <label
          htmlFor={id}
          className={cn(
            "flex cursor-pointer items-start gap-3",
            (disabled || loading) &&
              "cursor-not-allowed opacity-60"
          )}
        >
          <div className="relative mt-0.5">

            <input
              {...props}
              id={id}
              ref={assignRef}
              type="checkbox"
              checked={checked}
              disabled={disabled || loading}
              className="peer sr-only"
            />

            <div
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded border transition-all",

                error
                  ? "border-red-500"
                  : "border-slate-300",

                "peer-checked:border-blue-600 peer-checked:bg-blue-600",

                "peer-focus:ring-4 peer-focus:ring-blue-100"
              )}
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
              ) : indeterminate ? (
                <Minus className="h-3.5 w-3.5 text-white" />
              ) : checked ? (
                <Check className="h-3.5 w-3.5 text-white" />
              ) : null}
            </div>

          </div>

          <div className="space-y-1">

            {label && (
              <p className="text-sm font-medium text-slate-900">
                {label}
              </p>
            )}

            {description && (
              <p className="text-sm text-slate-500">
                {description}
              </p>
            )}

          </div>

        </label>

        {error && (
          <p className="pl-8 text-sm text-red-600">
            {error}
          </p>
        )}

      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;