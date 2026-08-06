import { ReactNode } from "react";

/**
 * Generic table row.
 */
export type TableRow = Record<string, unknown>;

/**
 * Column alignment.
 */
export type ColumnAlign =
  | "left"
  | "center"
  | "right";

/**
 * Sort direction.
 */
export type SortDirection =
  | "asc"
  | "desc";

/**
 * Column definition.
 */
export interface TableColumn<T extends TableRow> {
  /**
   * Unique column identifier.
   */
  id: string;

  /**
   * Property name on the row.
   */
  accessor: keyof T;

  /**
   * Column title.
   */
  header: ReactNode;

  /**
   * Optional custom cell renderer.
   */
  cell?: (
    value: T[keyof T],
    row: T
  ) => ReactNode;

  /**
   * Column width.
   */
  width?: number | string;

  /**
   * Text alignment.
   */
  align?: ColumnAlign;

  /**
   * Hide column.
   */
  hidden?: boolean;

  /**
   * Allow sorting.
   */
  sortable?: boolean;

  /**
   * Allow searching.
   */
  searchable?: boolean;

  /**
   * Allow filtering.
   */
  filterable?: boolean;

  /**
   * Allow exporting.
   */
  exportable?: boolean;
}

/**
 * Current sort state.
 */
export interface TableSort<T extends TableRow> {
  accessor: keyof T;

  direction: SortDirection;
}

/**
 * Generic filter.
 */
export interface TableFilter {
  field: string;

  value: unknown;
}

/**
 * Pagination state.
 */
export interface TablePagination {
  page: number;

  pageSize: number;

  totalItems: number;

  totalPages: number;
}

/**
 * Row selection.
 */
export interface TableSelection {
  selectedRows: string[];

  selectAll: boolean;
}

/**
 * Table configuration.
 */
export interface UseTableOptions<
  T extends TableRow
> {
  /**
   * Source data.
   */
  data: T[];

  /**
   * Column definitions.
   */
  columns: TableColumn<T>[];

  /**
   * Row ID accessor.
   */
  rowId: keyof T;

  /**
   * Enable search.
   */
  searchable?: boolean;

  /**
   * Enable sorting.
   */
  sortable?: boolean;

  /**
   * Enable filters.
   */
  filterable?: boolean;

  /**
   * Enable pagination.
   */
  pagination?: boolean;

  /**
   * Enable row selection.
   */
  selectable?: boolean;

  /**
   * Initial page size.
   */
  pageSize?: number;
}

/**
 * Public table API.
 */
export interface UseTableReturn<
  T extends TableRow
> {
  /**
   * Original rows.
   */
  rows: T[];

  /**
   * Visible rows.
   */
  visibleRows: T[];

  /**
   * Columns.
   */
  columns: TableColumn<T>[];

  /**
   * Search.
   */
  search: string;

  setSearch: (
    value: string
  ) => void;

  /**
   * Sorting.
   */
  sorting?: TableSort<T>;

  setSorting: (
    sorting?: TableSort<T>
  ) => void;

  /**
   * Filters.
   */
  filters: TableFilter[];

  setFilters: (
    filters: TableFilter[]
  ) => void;

  /**
   * Pagination.
   */
  pagination: TablePagination;

  setPage: (
    page: number
  ) => void;

  setPageSize: (
    size: number
  ) => void;

  /**
   * Selection.
   */
  selection: TableSelection;

  toggleRow: (
    id: string
  ) => void;

  toggleAll: () => void;

  clearSelection: () => void;
}