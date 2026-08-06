"use client";

import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;

  rounded?: "sm" | "md" | "lg" | "xl" | "full";

  animate?: boolean;
}

const roundedClasses = {
  sm: "rounded",

  md: "rounded-md",

  lg: "rounded-lg",

  xl: "rounded-xl",

  full: "rounded-full",
};

export default function Skeleton({
  className,
  rounded = "md",
  animate = true,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-slate-200",

        roundedClasses[rounded],

        animate && "animate-pulse",

        className
      )}
    />
  );
}