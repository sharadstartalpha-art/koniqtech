"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  TableRow,
  TableSort,
} from "./types";

import { sortRows } from "./utils";

export interface UseSortingResult<
  T extends TableRow
> {
  sorting?: TableSort<T>;

  setSorting: (
    value?: TableSort<T>
  ) => void;

  toggleSorting: (
    accessor: keyof T
  ) => void;

  sortedRows: T[];
}

export function useSorting<
  T extends TableRow
>(
  rows: T[]
): UseSortingResult<T> {
  const [sorting, setSorting] =
    useState<TableSort<T>>();

  function toggleSorting(
    accessor: keyof T
  ) {
    setSorting((previous) => {
      if (
        !previous ||
        previous.accessor !== accessor
      ) {
        return {
          accessor,
          direction: "asc",
        };
      }

      if (
        previous.direction === "asc"
      ) {
        return {
          accessor,
          direction: "desc",
        };
      }

      return undefined;
    });
  }

  const sortedRows = useMemo(
    () => sortRows(rows, sorting),
    [rows, sorting]
  );

  return {
    sorting,
    setSorting,
    toggleSorting,
    sortedRows,
  };
}