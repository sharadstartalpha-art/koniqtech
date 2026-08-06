"use client";

import { useEffect, useMemo, useState } from "react";

export interface UsePaginationOptions {
  initialPage?: number;

  initialPageSize?: number;

  pageSizeOptions?: number[];
}

export interface UsePaginationReturn<T> {
  page: number;

  pageSize: number;

  totalPages: number;

  totalItems: number;

  paginatedData: T[];

  pageSizeOptions: number[];

  canPrevious: boolean;

  canNext: boolean;

  setPage: (page: number) => void;

  nextPage: () => void;

  previousPage: () => void;

  firstPage: () => void;

  lastPage: () => void;

  setPageSize: (size: number) => void;
}

export function usePagination<T>(
  data: T[],
  {
    initialPage = 1,
    initialPageSize = 10,
    pageSizeOptions = [10, 25, 50, 100],
  }: UsePaginationOptions = {}
): UsePaginationReturn<T> {
  const [page, setPage] =
    useState(initialPage);

  const [pageSize, setPageSizeState] =
    useState(initialPageSize);

  const totalItems = data.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedData = useMemo(() => {
    const start =
      (page - 1) * pageSize;

    const end = start + pageSize;

    return data.slice(start, end);
  }, [data, page, pageSize]);

  function nextPage() {
    setPage((previous) =>
      Math.min(previous + 1, totalPages)
    );
  }

  function previousPage() {
    setPage((previous) =>
      Math.max(previous - 1, 1)
    );
  }

  function firstPage() {
    setPage(1);
  }

  function lastPage() {
    setPage(totalPages);
  }

  function setPageSize(size: number) {
    setPageSizeState(size);

    setPage(1);
  }

  return {
    page,

    pageSize,

    totalPages,

    totalItems,

    paginatedData,

    pageSizeOptions,

    canPrevious: page > 1,

    canNext: page < totalPages,

    setPage,

    nextPage,

    previousPage,

    firstPage,

    lastPage,

    setPageSize,
  };
}