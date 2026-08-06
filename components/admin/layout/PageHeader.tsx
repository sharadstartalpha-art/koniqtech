"use client";

import { ReactNode } from "react";
import Link from "next/link";
import {
  ChevronRight,
  RefreshCw,
} from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;

  description?: string;

  badge?: ReactNode;

  breadcrumbs?: BreadcrumbItem[];

  actions?: ReactNode;

  onRefresh?: () => void;

  refreshing?: boolean;
}

export default function PageHeader({
  title,
  description,
  badge,
  breadcrumbs = [],
  actions,
  onRefresh,
  refreshing = false,
}: PageHeaderProps) {
  return (
    <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      {/* Breadcrumb */}

      {breadcrumbs.length > 0 && (
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">

          {breadcrumbs.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="flex items-center gap-2"
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className="transition hover:text-blue-600"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-slate-900">
                  {item.label}
                </span>
              )}

              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </div>
          ))}
        </nav>
      )}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

        {/* Left */}

        <div className="space-y-3">

          <div className="flex flex-wrap items-center gap-3">

            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>

            {badge}
          </div>

          {description && (
            <p className="max-w-3xl text-base leading-7 text-slate-600">
              {description}
            </p>
          )}

        </div>

        {/* Right */}

        <div className="flex flex-wrap items-center gap-3">

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />

              Refresh
            </button>
          )}

          {actions}

        </div>

      </div>
    </header>
  );
}