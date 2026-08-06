"use client";

import { useMemo, useState } from "react";

import { TableColumn, TableRow } from "./types";
import { searchRows } from "./utils";

export interface UseSearchResult<T extends TableRow> {
  search: string;

  setSearch: (value: string) => void;

  searchedRows: T[];
}

export function useSearch<T extends TableRow>(
  rows: T[],
  columns: TableColumn<T>[]
): UseSearchResult<T> {
  const [search, setSearch] =
    useState("");

  const searchableFields = useMemo(
    () =>
      columns
        .filter(
          (column) => column.searchable !== false
        )
        .map(
          (column) => column.accessor
        ),
    [columns]
  );

  const searchedRows = useMemo(
    () =>
      searchRows(
        rows,
        search,
        searchableFields
      ),
    [
      rows,
      search,
      searchableFields,
    ]
  );

  return {
    search,
    setSearch,
    searchedRows,
  };
}