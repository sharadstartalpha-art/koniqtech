"use client";

import { cn } from "@/lib/utils";

export interface ProgressProps {
  value: number;

  max?: number;

  label?: string;

  showValue?: boolean;

  color?:
    | "primary"
    | "success"
    | "warning"
    | "danger";

  size?: "sm" | "md" | "lg";

  animated?: boolean;

  striped?: boolean;

  className?: string;
}

const colors = {
  primary: "bg-blue-600",

  success: "bg-green-600",

  warning: "bg-orange-500",

  danger: "bg-red-600",
};

const heights = {
  sm: "h-2",

  md: "h-3",

  lg: "h-4",
};

export default function Progress({
  value,
  max = 100,
  label,
  showValue = true,
  color = "primary",
  size = "md",
  animated = true,
  striped = false,
  className,
}: ProgressProps) {
  const percentage = Math.min(
    100,
    Math.max(0, (value / max) * 100)
  );

  return (
    <div
      className={cn(
        "w-full space-y-2",
        className
      )}
    >
      {(label || showValue) && (
        <div className="flex items-center justify-between">

          {label && (
            <span className="text-sm font-medium text-slate-700">
              {label}
            </span>
          )}

          {showValue && (
            <span className="text-sm text-slate-500">
              {Math.round(percentage)}%
            </span>
          )}

        </div>
      )}

      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-slate-200",

          heights[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full",

            colors[color],

            animated &&
              "transition-all duration-500 ease-in-out",

            striped &&
              "bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]",

            striped &&
              "animate-[progress-stripes_1s_linear_infinite]"
          )}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}