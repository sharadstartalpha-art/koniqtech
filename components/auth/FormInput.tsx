"use client";

import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
} from "react";

import clsx from "clsx";

interface FormInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className,
      containerClassName,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const inputId =
      id ??
      label
        .toLowerCase()
        .replace(/\s+/g, "-");

    return (
      <div className={clsx("space-y-2", containerClassName)}>
        {/* Label */}

        <label
          htmlFor={inputId}
          className="flex items-center gap-1 text-sm font-semibold text-slate-700"
        >
          {label}

          {required && (
            <span className="text-red-500">*</span>
          )}
        </label>

        {/* Input */}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            className={clsx(
              "w-full rounded-2xl border bg-white py-3 text-slate-900 shadow-sm transition-all duration-200 outline-none",

              leftIcon ? "pl-12" : "pl-4",

              rightIcon ? "pr-12" : "pr-4",

              error
                ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-slate-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100",

              disabled &&
                "cursor-not-allowed bg-slate-100 opacity-60",

              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error */}

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm font-medium text-red-600"
          >
            {error}
          </p>
        )}

        {/* Helper */}

        {!error && helperText && (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-slate-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;