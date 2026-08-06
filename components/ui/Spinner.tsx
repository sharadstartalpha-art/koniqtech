"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";

  className?: string;

  label?: string;

  fullScreen?: boolean;
}

const sizes = {
  xs: "h-3 w-3",

  sm: "h-4 w-4",

  md: "h-6 w-6",

  lg: "h-8 w-8",

  xl: "h-12 w-12",
};

export default function Spinner({
  size = "md",
  className,
  label,
  fullScreen = false,
}: SpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2
        className={cn(
          "animate-spin text-blue-600",
          sizes[size],
          className
        )}
      />

      {label && (
        <p className="text-sm text-slate-500">
          {label}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        {content}
      </div>
    );
  }

  return content;
}