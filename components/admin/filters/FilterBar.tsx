"use client";

import { ReactNode } from "react";
import { Filter, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  search?: ReactNode;

  filters?: ReactNode;

  actions?: ReactNode;

  onReset?: () => void;

  className?: string;

  sticky?: boolean;

  title?: string;

  subtitle?: string;
}

export default function FilterBar({
  search,
  filters,
  actions,
  onReset,
  className,
  sticky = false,
  title,
  subtitle,
}: FilterBarProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        sticky && "sticky top-4 z-20",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="border-b border-slate-100 px-6 py-5">

          {title && (
            <h2 className="text-lg font-semibold text-slate-900">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          )}

        </div>
      )}

      <div className="space-y-5 p-6">

        {/* Search */}

        {search}

        {/* Filters */}

        {filters && (
          <div className="flex flex-wrap items-center gap-4">

            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">

              <Filter className="h-4 w-4" />

              Filters

            </div>

            <div className="flex flex-1 flex-wrap gap-4">
              {filters}
            </div>

            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <RotateCcw className="h-4 w-4" />

                Reset
              </button>
            )}

          </div>
        )}

        {/* Actions */}

        {actions && (
          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
            {actions}
          </div>
        )}

      </div>
    </section>
  );
}