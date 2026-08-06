"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  TableFilter,
  TableRow,
} from "./types";

import { filterRows } from "./utils";

export interface UseFilteringResult<
  T extends TableRow
> {
  filters: TableFilter[];

  setFilters: (
    filters: TableFilter[]
  ) => void;

  addFilter: (
    filter: TableFilter
  ) => void;

  removeFilter: (
    field: string
  ) => void;

  clearFilters: () => void;

  filteredRows: T[];
}

export function useFiltering<
  T extends TableRow
>(
  rows: T[]
): UseFilteringResult<T> {
  const [filters, setFilters] =
    useState<TableFilter[]>([]);

  function addFilter(
    filter: TableFilter
  ) {
    setFilters((previous) => [
      ...previous.filter(
        (item) =>
          item.field !== filter.field
      ),
      filter,
    ]);
  }

  function removeFilter(
    field: string
  ) {
    setFilters((previous) =>
      previous.filter(
        (item) =>
          item.field !== field
      )
    );
  }

  function clearFilters() {
    setFilters([]);
  }

  const filteredRows = useMemo(
    () => filterRows(rows, filters),
    [rows, filters]
  );

  return {
    filters,

    setFilters,

    addFilter,

    removeFilter,

    clearFilters,

    filteredRows,
  };
}