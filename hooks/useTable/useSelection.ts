"use client";

import {
  useMemo,
  useState,
} from "react";

import { TableRow } from "./types";

import {
  clearSelection,
  isRowSelected,
  selectAllRows,
  toggleRowSelection,
} from "./utils";

export interface UseSelectionResult<
  T extends TableRow
> {
  selectedRows: string[];

  toggleRow: (
    id: string
  ) => void;

  toggleAll: () => void;

  clear: () => void;

  isSelected: (
    id: string
  ) => boolean;

  allSelected: boolean;

  someSelected: boolean;
}

export function useSelection<
  T extends TableRow
>(
  rows: T[],
  rowId: keyof T
): UseSelectionResult<T> {
  const [selectedRows, setSelectedRows] =
    useState<string[]>([]);

  function toggleRow(id: string) {
    setSelectedRows((previous) =>
      toggleRowSelection(
        id,
        previous
      )
    );
  }

  function toggleAll() {
    setSelectedRows((previous) =>
      previous.length === rows.length
        ? clearSelection()
        : selectAllRows(
            rows,
            rowId
          )
    );
  }

  function clear() {
    setSelectedRows(
      clearSelection()
    );
  }

  const allSelected =
    rows.length > 0 &&
    selectedRows.length === rows.length;

  const someSelected =
    selectedRows.length > 0 &&
    !allSelected;

  const isSelected = useMemo(
    () => (id: string) =>
      isRowSelected(
        id,
        selectedRows
      ),
    [selectedRows]
  );

  return {
    selectedRows,

    toggleRow,

    toggleAll,

    clear,

    isSelected,

    allSelected,

    someSelected,
  };
}