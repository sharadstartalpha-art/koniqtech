"use client";

import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./Button";
import Select from "./Select";

export interface PaginationProps {
  page: number;

  totalPages: number;

  totalItems?: number;

  pageSize?: number;

  pageSizeOptions?: number[];

  onPageChange: (page: number) => void;

  onPageSizeChange?: (
    pageSize: number
  ) => void;

  className?: string;
}

function getPages(
  current: number,
  total: number
): (number | "...")[] {
  if (total <= 7) {
    return Array.from(
      { length: total },
      (_, i) => i + 1
    );
  }

  if (current <= 3) {
    return [1, 2, 3, 4, "...", total];
  }

  if (current >= total - 2) {
    return [
      1,
      "...",
      total - 3,
      total - 2,
      total - 1,
      total,
    ];
  }

  return [
    1,
    "...",
    current - 1,
    current,
    current + 1,
    "...",
    total,
  ];
}

export default function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize = 10,
  pageSizeOptions = [
    10,
    25,
    50,
    100,
  ],
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationProps) {
  const pages = getPages(
    page,
    totalPages
  );

  const start =
    totalItems === undefined
      ? undefined
      : (page - 1) * pageSize + 1;

  const end =
    totalItems === undefined
      ? undefined
      : Math.min(
          page * pageSize,
          totalItems
        );

  return (
    <div
      className={cn(
        "flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 lg:flex-row lg:items-center lg:justify-between",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-4">

        {totalItems !== undefined && (
          <p className="text-sm text-slate-600">
            Showing{" "}
            <strong>{start}</strong>
            {" - "}
            <strong>{end}</strong>
            {" of "}
            <strong>{totalItems}</strong>
          </p>
        )}

        {onPageSizeChange && (
          <div className="w-36">
            <Select
              value={String(pageSize)}
              onChange={(e) =>
                onPageSizeChange(
                  Number(e.target.value)
                )
              }
              placeholder=""
              options={pageSizeOptions.map(
                (size) => ({
                  label: `${size} / page`,
                  value: String(size),
                })
              )}
            />
          </div>
        )}

      </div>

      <div className="flex flex-wrap items-center gap-2">

        <Button
          size="icon"
          variant="outline"
          disabled={page === 1}
          onClick={() =>
            onPageChange(1)
          }
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="outline"
          disabled={page === 1}
          onClick={() =>
            onPageChange(page - 1)
          }
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((item, index) => {
          if (item === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-slate-400"
              >
                ...
              </span>
            );
          }

          return (
            <Button
              key={item}
              size="icon"
              variant={
                item === page
                  ? "primary"
                  : "outline"
              }
              onClick={() =>
                onPageChange(item)
              }
            >
              {item}
            </Button>
          );
        })}

        <Button
          size="icon"
          variant="outline"
          disabled={
            page === totalPages
          }
          onClick={() =>
            onPageChange(page + 1)
          }
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="outline"
          disabled={
            page === totalPages
          }
          onClick={() =>
            onPageChange(totalPages)
          }
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>

      </div>
    </div>
  );
}