"use client";

import {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { Loader2 } from "lucide-react";
import clsx from "clsx";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "success"
  | "danger";

type Size =
  | "sm"
  | "md"
  | "lg";

interface LoadingButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus:ring-orange-200",

  secondary:
    "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-200",

  outline:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200",

  success:
    "bg-green-600 text-white hover:bg-green-700 focus:ring-green-200",

  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-200",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-base",
};

export default function LoadingButton({
  children,
  loading = false,
  loadingText = "Loading...",
  leftIcon,
  rightIcon,
  disabled,
  fullWidth = true,
  variant = "primary",
  size = "lg",
  className,
  type = "button",
  ...props
}: LoadingButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200",
        "focus:outline-none focus:ring-4",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "active:scale-[0.98]",

        variantClasses[variant],
        sizeClasses[size],

        fullWidth && "w-full",

        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />

          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {leftIcon}

          <span>{children}</span>

          {rightIcon}
        </>
      )}
    </button>
  );
}