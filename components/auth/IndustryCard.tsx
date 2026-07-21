"use client";

import clsx from "clsx";
import {
  ArrowRight,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";

export interface IndustryCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient?: string;
  badge?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: (id: string) => void;
  className?: string;
}

export default function IndustryCard({
  id,
  title,
  description,
  icon: Icon,
  gradient = "from-orange-500 to-red-500",
  badge,
  selected = false,
  disabled = false,
  onClick,
  className,
}: IndustryCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onClick?.(id)}
      aria-pressed={selected}
      className={clsx(
        "group relative w-full overflow-hidden rounded-3xl border bg-white p-6 text-left transition-all duration-300",
        selected
          ? "border-orange-500 ring-2 ring-orange-200 shadow-xl"
          : "border-slate-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
    >
      {/* Background Glow */}

      <div
        className={clsx(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          gradient
        )}
      />

      {/* Selected Badge */}

      {selected && (
        <div className="absolute right-5 top-5">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        </div>
      )}

      {/* Badge */}

      {badge && (
        <div className="mb-4 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          {badge}
        </div>
      )}

      {/* Icon */}

      <div
        className={clsx(
          "mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110",
          gradient
        )}
      >
        <Icon className="h-8 w-8" />
      </div>

      {/* Content */}

      <h3 className="text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-600">
        {description}
      </p>

      {/* Footer */}

      <div className="mt-6 flex items-center justify-between">
        <span
          className={clsx(
            "text-sm font-semibold transition-colors",
            selected
              ? "text-orange-600"
              : "text-slate-500 group-hover:text-orange-600"
          )}
        >
          {selected ? "Selected" : "Choose Industry"}
        </span>

        <ArrowRight
          className={clsx(
            "h-5 w-5 transition-all duration-300",
            selected
              ? "translate-x-1 text-orange-600"
              : "text-slate-400 group-hover:translate-x-1 group-hover:text-orange-600"
          )}
        />
      </div>
    </button>
  );
}