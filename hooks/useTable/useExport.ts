"use client";

import { useCallback } from "react";
import { TableColumn, TableRow } from "./types";
import { DEFAULT_EXPORT_FILENAME } from "./constants";

export interface UseExportResult<T extends TableRow> {
  exportCsv: (
    rows: T[],
    columns: TableColumn<T>[],
    filename?: string
  ) => void;

  exportJson: (
    rows: T[],
    filename?: string
  ) => void;
}

export function useExport<
  T extends TableRow
>(): UseExportResult<T> {
  const download = useCallback(
    (
      content: string,
      type: string,
      filename: string
    ) => {
      const blob = new Blob(
        [content],
        { type }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download = filename;
      link.click();

      URL.revokeObjectURL(url);
    },
    []
  );

  const exportCsv =
    useCallback(
      (
        rows: T[],
        columns: TableColumn<T>[],
        filename = DEFAULT_EXPORT_FILENAME
      ) => {
        const exportable =
          columns.filter(
            (column) =>
              column.exportable !==
                false &&
              !column.hidden
          );

        const header =
          exportable.map((c) =>
            String(c.header)
          );

        const data = rows.map(
          (row) =>
            exportable.map((column) =>
              String(
                row[column.accessor] ??
                  ""
              )
            )
        );

        const csv = [
          header,
          ...data,
        ]
          .map((row) =>
            row.join(",")
          )
          .join("\n");

        download(
          csv,
          "text/csv",
          `${filename}.csv`
        );
      },
      [download]
    );

  const exportJson =
    useCallback(
      (
        rows: T[],
        filename = DEFAULT_EXPORT_FILENAME
      ) => {
        download(
          JSON.stringify(
            rows,
            null,
            2
          ),
          "application/json",
          `${filename}.json`
        );
      },
      [download]
    );

  return {
    exportCsv,
    exportJson,
  };
}