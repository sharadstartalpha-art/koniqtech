"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CardProps {
  children: ReactNode;

  className?: string;

  padding?: "none" | "sm" | "md" | "lg";

  shadow?: "none" | "sm" | "md" | "lg";

  bordered?: boolean;

  hover?: boolean;

  rounded?: "md" | "lg" | "xl" | "2xl";

  onClick?: () => void;
}

const paddingClasses = {
  none: "",

  sm: "p-4",

  md: "p-6",

  lg: "p-8",
};

const shadowClasses = {
  none: "",

  sm: "shadow-sm",

  md: "shadow",

  lg: "shadow-lg",
};

const roundedClasses = {
  md: "rounded-lg",

  lg: "rounded-xl",

  xl: "rounded-2xl",

  "2xl": "rounded-3xl",
};

export default function Card({
  children,
  className,
  padding = "md",
  shadow = "sm",
  bordered = true,
  hover = false,
  rounded = "xl",
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white transition-all duration-200",

        roundedClasses[rounded],

        paddingClasses[padding],

        shadowClasses[shadow],

        bordered && "border border-slate-200",

        hover &&
          "cursor-pointer hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg",

        className
      )}
    >
      {children}
    </div>
  );
}