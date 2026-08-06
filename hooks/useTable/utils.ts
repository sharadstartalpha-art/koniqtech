import {
  TableFilter,
  TableRow,
  TableSort,
} from "./types";

/**
 * Safely gets a nested value using dot notation.
 *
 * Example:
 * getNestedValue(user, "organization.name")
 */
export function getNestedValue(
  obj: unknown,
  path: string
): unknown {
  if (!obj || !path) {
    return undefined;
  }

  return path
    .split(".")
    .reduce<unknown>((value, key) => {
      if (
        value &&
        typeof value === "object"
      ) {
        return (value as Record<string, unknown>)[key];
      }

      return undefined;
    }, obj);
}

/**
 * Converts any value into a searchable string.
 */
export function normalizeValue(
  value: unknown
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value)
    .trim()
    .toLowerCase();
}

/**
 * Performs global search across searchable columns.
 */
export function searchRows<
  T extends TableRow
>(
  rows: T[],
  search: string,
  searchableFields: (keyof T)[]
): T[] {
  if (!search.trim()) {
    return rows;
  }

  const query =
    normalizeValue(search);

  return rows.filter((row) =>
    searchableFields.some((field) =>
      normalizeValue(row[field]).includes(
        query
      )
    )
  );
}

/**
 * Applies all active filters.
 */
export function filterRows<
  T extends TableRow
>(
  rows: T[],
  filters: TableFilter[]
): T[] {
  if (!filters.length) {
    return rows;
  }

  return rows.filter((row) =>
    filters.every((filter) => {
      const value = getNestedValue(
        row,
        filter.field
      );

      return (
        normalizeValue(value) ===
        normalizeValue(filter.value)
      );
    })
  );
}

/**
 * Compare two values for sorting.
 */
export function compareValues(
  a: unknown,
  b: unknown
): number {
  if (a === b) {
    return 0;
  }

  if (a === null || a === undefined) {
    return -1;
  }

  if (b === null || b === undefined) {
    return 1;
  }

  if (
    typeof a === "number" &&
    typeof b === "number"
  ) {
    return a - b;
  }

  if (
    a instanceof Date &&
    b instanceof Date
  ) {
    return (
      a.getTime() - b.getTime()
    );
  }

  return String(a).localeCompare(
    String(b),
    undefined,
    {
      numeric: true,
      sensitivity: "base",
    }
  );
}

/**
 * Sort rows.
 */
export function sortRows<
  T extends TableRow
>(
  rows: T[],
  sorting?: TableSort<T>
): T[] {
  if (!sorting) {
    return rows;
  }

  const sorted = [...rows];

  sorted.sort((a, b) => {
    const left =
      a[sorting.accessor];

    const right =
      b[sorting.accessor];

    const comparison =
      compareValues(left, right);

    return sorting.direction === "asc"
      ? comparison
      : -comparison;
  });

  return sorted;
}

/**
 * Paginate rows.
 */
export function paginateRows<
  T extends TableRow
>(
  rows: T[],
  page: number,
  pageSize: number
): T[] {
  const start =
    (page - 1) * pageSize;

  return rows.slice(
    start,
    start + pageSize
  );
}

/**
 * Check whether a row is selected.
 */
export function isRowSelected(
  id: string,
  selected: string[]
): boolean {
  return selected.includes(id);
}

/**
 * Toggle row selection.
 */
export function toggleRowSelection(
  id: string,
  selected: string[]
): string[] {
  return selected.includes(id)
    ? selected.filter(
        (item) => item !== id
      )
    : [...selected, id];
}

/**
 * Select all rows.
 */
export function selectAllRows<
  T extends TableRow
>(
  rows: T[],
  rowId: keyof T
): string[] {
  return rows.map((row) =>
    String(row[rowId])
  );
}

/**
 * Remove all selections.
 */
export function clearSelection(): string[] {
  return [];
}