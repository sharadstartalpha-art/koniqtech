"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple"
  | "outline";

export type BadgeSize =
  | "sm"
  | "md"
  | "lg";

interface BadgeProps {
  children: ReactNode;

  variant?: BadgeVariant;

  size?: BadgeSize;

  rounded?: boolean;

  icon?: ReactNode;

  className?: string;
}

const variants: Record<
  BadgeVariant,
  string
> = {
  default:
    "bg-slate-100 text-slate-700",

  primary:
    "bg-blue-100 text-blue-700",

  secondary:
    "bg-slate-800 text-white",

  success:
    "bg-green-100 text-green-700",

  warning:
    "bg-orange-100 text-orange-700",

  danger:
    "bg-red-100 text-red-700",

  info:
    "bg-cyan-100 text-cyan-700",

  purple:
    "bg-purple-100 text-purple-700",

  outline:
    "border border-slate-300 bg-white text-slate-700",
};

const sizes: Record<
  BadgeSize,
  string
> = {
  sm: "px-2 py-0.5 text-xs",

  md: "px-3 py-1 text-sm",

  lg: "px-4 py-1.5 text-sm",
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  rounded = true,
  icon,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium transition-colors",

        rounded
          ? "rounded-full"
          : "rounded-lg",

        variants[variant],

        sizes[size],

        className
      )}
    >
      {icon}

      {children}
    </span>
  );
}