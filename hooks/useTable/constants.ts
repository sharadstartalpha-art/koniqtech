import { SortDirection } from "./types";

/**
 * Default page size.
 */
export const DEFAULT_PAGE_SIZE = 25;

/**
 * Available page sizes.
 */
export const DEFAULT_PAGE_SIZE_OPTIONS = [
  10,
  25,
  50,
  100,
] as const;

/**
 * Default search placeholder.
 */
export const DEFAULT_SEARCH_PLACEHOLDER =
  "Search...";

/**
 * Default sort direction.
 */
export const DEFAULT_SORT_DIRECTION: SortDirection =
  "asc";

/**
 * Maximum selectable rows.
 * Set to Infinity for unlimited.
 */
export const MAX_SELECTION = Infinity;

/**
 * Debounce delay (milliseconds)
 * for search inputs.
 */
export const SEARCH_DEBOUNCE_MS = 300;

/**
 * Export formats.
 */
export const EXPORT_FORMATS = [
  "csv",
  "xlsx",
  "json",
] as const;

export type ExportFormat =
  (typeof EXPORT_FORMATS)[number];

/**
 * Default visible columns.
 */
export const DEFAULT_COLUMN_VISIBLE =
  true;

/**
 * Default column settings.
 */
export const DEFAULT_COLUMN = {
  sortable: true,

  searchable: true,

  filterable: true,

  exportable: true,

  hidden: false,

  align: "left" as const,
};

/**
 * Empty search query.
 */
export const EMPTY_SEARCH = "";

/**
 * Empty filters.
 */
export const EMPTY_FILTERS = [];

/**
 * Initial page.
 */
export const INITIAL_PAGE = 1;

/**
 * Default animation duration.
 */
export const TABLE_ANIMATION_MS = 200;

/**
 * CSV delimiter.
 */
export const CSV_DELIMITER = ",";

/**
 * Default filename.
 */
export const DEFAULT_EXPORT_FILENAME =
  "export";

/**
 * Supported export MIME types.
 */
export const EXPORT_MIME_TYPES = {
  csv: "text/csv",

  json: "application/json",

  xlsx:
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
} as const;

/**
 * Empty state messages.
 */
export const TABLE_MESSAGES = {
  noData: "No records found.",

  noSearchResults:
    "No matching records found.",

  loading: "Loading...",

  error:
    "Unable to load records.",
} as const;