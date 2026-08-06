"use client";

import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;

  description?: string;

  icon?: ReactNode;

  badge?: ReactNode;

  actions?: ReactNode;

  footer?: ReactNode;

  children: ReactNode;

  className?: string;

  contentClassName?: string;

  collapsible?: boolean;

  defaultCollapsed?: boolean;
}

export default function SectionCard({
  title,
  description,
  icon,
  badge,
  actions,
  footer,
  children,
  className,
  contentClassName,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
        className
      )}
    >
      {/* Header */}

      <div className="flex flex-col gap-5 border-b border-slate-100 p-6 lg:flex-row lg:items-start lg:justify-between">

        <div className="flex items-start gap-4">

          {icon && (
            <div className="rounded-xl bg-slate-100 p-3">
              {icon}
            </div>
          )}

          <div>

            <div className="flex flex-wrap items-center gap-3">

              <h2 className="text-xl font-semibold text-slate-900">
                {title}
              </h2>

              {badge}

            </div>

            {description && (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                {description}
              </p>
            )}

          </div>

        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-3">
            {actions}
          </div>
        )}

      </div>

      {/* Content */}

      <div
        className={cn(
          "p-6",
          contentClassName
        )}
      >
        {children}
      </div>

      {/* Footer */}

      {footer && (
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
          {footer}
        </div>
      )}
    </section>
  );
}