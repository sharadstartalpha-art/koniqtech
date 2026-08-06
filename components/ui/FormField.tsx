"use client";

import { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  id?: string;

  label?: string;

  description?: string;

  error?: string;

  required?: boolean;

  optional?: boolean;

  children: ReactNode;

  className?: string;

  labelClassName?: string;

  descriptionClassName?: string;

  errorClassName?: string;
}

export default function FormField({
  id,
  label,
  description,
  error,
  required = false,
  optional = false,
  children,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
}: FormFieldProps) {
  return (
    <div
      className={cn(
        "space-y-2",
        className
      )}
    >
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "flex items-center gap-2 text-sm font-medium text-slate-700",
            labelClassName
          )}
        >
          <span>{label}</span>

          {required && (
            <span className="text-red-500">
              *
            </span>
          )}

          {!required && optional && (
            <span className="text-xs font-normal text-slate-400">
              Optional
            </span>
          )}
        </label>
      )}

      {description && !error && (
        <p
          className={cn(
            "text-sm text-slate-500",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}

      {children}

      {error && (
        <div
          className={cn(
            "flex items-center gap-2 text-sm text-red-600",
            errorClassName
          )}
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />

          <span>{error}</span>
        </div>
      )}
    </div>
  );
}