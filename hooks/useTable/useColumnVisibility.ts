"use client";

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  TableColumn,
  TableRow,
} from "./types";

export interface UseColumnVisibilityResult<
  T extends TableRow
> {
  columns: TableColumn<T>[];

  visibleColumns: TableColumn<T>[];

  hiddenColumns: TableColumn<T>[];

  toggleColumn: (id: string) => void;

  showColumn: (id: string) => void;

  hideColumn: (id: string) => void;

  showAll: () => void;

  hideAll: () => void;

  reset: () => void;

  isVisible: (id: string) => boolean;
}

export function useColumnVisibility<
  T extends TableRow
>(
  initialColumns: TableColumn<T>[]
): UseColumnVisibilityResult<T> {
  const [columns, setColumns] =
    useState(initialColumns);

  const visibleColumns =
    useMemo(
      () =>
        columns.filter(
          (column) =>
            !column.hidden
        ),
      [columns]
    );

  const hiddenColumns =
    useMemo(
      () =>
        columns.filter(
          (column) =>
            column.hidden
        ),
      [columns]
    );

  const updateColumn =
    useCallback(
      (
        id: string,
        hidden: boolean
      ) => {
        setColumns((previous) =>
          previous.map((column) =>
            column.id === id
              ? {
                  ...column,
                  hidden,
                }
              : column
          )
        );
      },
      []
    );

  const toggleColumn =
    useCallback((id: string) => {
      setColumns((previous) =>
        previous.map((column) =>
          column.id === id
            ? {
                ...column,
                hidden:
                  !column.hidden,
              }
            : column
        )
      );
    }, []);

  const showColumn =
    useCallback(
      (id: string) =>
        updateColumn(id, false),
      [updateColumn]
    );

  const hideColumn =
    useCallback(
      (id: string) =>
        updateColumn(id, true),
      [updateColumn]
    );

  const showAll =
    useCallback(() => {
      setColumns((previous) =>
        previous.map((column) => ({
          ...column,
          hidden: false,
        }))
      );
    }, []);

  const hideAll =
    useCallback(() => {
      setColumns((previous) =>
        previous.map((column) => ({
          ...column,
          hidden: true,
        }))
      );
    }, []);

  const reset =
    useCallback(() => {
      setColumns(initialColumns);
    }, [initialColumns]);

  const isVisible =
    useCallback(
      (id: string) =>
        columns.some(
          (column) =>
            column.id === id &&
            !column.hidden
        ),
      [columns]
    );

  return {
    columns,

    visibleColumns,

    hiddenColumns,

    toggleColumn,

    showColumn,

    hideColumn,

    showAll,

    hideAll,

    reset,

    isVisible,
  };
}