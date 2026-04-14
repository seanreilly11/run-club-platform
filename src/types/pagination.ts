/**
 * Cursor-based pagination types.
 * ALL paginated lists use this pattern — never offset-based pagination.
 */
export type PaginatedResult<T> = {
  items: T[];
  nextCursor: string | null; // null = no more pages
  hasMore: boolean;
};

export type PaginationParams = {
  cursor?: string; // omit for first page
  limit?: number; // default 20, max 50
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
