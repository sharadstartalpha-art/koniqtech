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

export interface UseColumnOrderResult<
  T extends TableRow
> {
  columns: TableColumn<T>[];

  moveColumn: (
    from: number,
    to: number
  ) => void;

  moveLeft: (id: string) => void;

  moveRight: (id: string) => void;

  reset: () => void;
}

export function useColumnOrder<
  T extends TableRow
>(
  initialColumns: TableColumn<T>[]
): UseColumnOrderResult<T> {
  const [columns, setColumns] =
    useState(initialColumns);

  const moveColumn =
    useCallback(
      (
        from: number,
        to: number
      ) => {
        setColumns((previous) => {
          const next = [
            ...previous,
          ];

          const [item] =
            next.splice(from, 1);

          next.splice(to, 0, item);

          return next;
        });
      },
      []
    );

  const moveLeft =
    useCallback(
      (id: string) => {
        const index =
          columns.findIndex(
            (column) =>
              column.id === id
          );

        if (index > 0) {
          moveColumn(
            index,
            index - 1
          );
        }
      },
      [columns, moveColumn]
    );

  const moveRight =
    useCallback(
      (id: string) => {
        const index =
          columns.findIndex(
            (column) =>
              column.id === id
          );

        if (
          index !== -1 &&
          index <
            columns.length - 1
        ) {
          moveColumn(
            index,
            index + 1
          );
        }
      },
      [columns, moveColumn]
    );

  const reset =
    useCallback(() => {
      setColumns(initialColumns);
    }, [initialColumns]);

  const orderedColumns =
    useMemo(
      () => columns,
      [columns]
    );

  return {
    columns: orderedColumns,

    moveColumn,

    moveLeft,

    moveRight,

    reset,
  };
}