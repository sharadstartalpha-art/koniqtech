"use client";

import { ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AlertVariant =
  | "success"
  | "error"
  | "warning"
  | "info";

interface AlertProps {
  title?: string;

  children?: ReactNode;

  variant?: AlertVariant;

  icon?: ReactNode;

  dismissible?: boolean;

  onDismiss?: () => void;

  className?: string;
}

const variants: Record<
  AlertVariant,
  {
    container: string;
    icon: ReactNode;
  }
> = {
  success: {
    container:
      "border-green-200 bg-green-50 text-green-900",

    icon: (
      <CheckCircle2 className="h-5 w-5 text-green-600" />
    ),
  },

  error: {
    container:
      "border-red-200 bg-red-50 text-red-900",

    icon: (
      <AlertCircle className="h-5 w-5 text-red-600" />
    ),
  },

  warning: {
    container:
      "border-orange-200 bg-orange-50 text-orange-900",

    icon: (
      <TriangleAlert className="h-5 w-5 text-orange-600" />
    ),
  },

  info: {
    container:
      "border-blue-200 bg-blue-50 text-blue-900",

    icon: (
      <Info className="h-5 w-5 text-blue-600" />
    ),
  },
};

export default function Alert({
  title,
  children,
  variant = "info",
  icon,
  dismissible = false,
  onDismiss,
  className,
}: AlertProps) {
  const config = variants[variant];

  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl border p-4 shadow-sm",
        config.container,
        className
      )}
    >
      <div className="flex items-start gap-3">

        <div className="mt-0.5 flex-shrink-0">
          {icon ?? config.icon}
        </div>

        <div className="min-w-0 flex-1">

          {title && (
            <h4 className="font-semibold">
              {title}
            </h4>
          )}

          {children && (
            <div
              className={cn(
                "text-sm leading-6",
                title && "mt-1"
              )}
            >
              {children}
            </div>
          )}

        </div>

        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg p-1 transition hover:bg-black/5"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}

      </div>
    </div>
  );
}