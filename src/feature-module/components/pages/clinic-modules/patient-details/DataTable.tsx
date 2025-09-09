import React, { useMemo, type ReactNode } from "react";

/** Generic column definition */
export type Column<T> = {
  /** Unique key for the column */
  key: string;
  /** Header label/node (this is your "headers") */
  header: ReactNode;
  /** Optional accessor when you don't supply a custom render */
  accessor?: (row: T) => ReactNode;
  /** Optional cell renderer (overrides accessor) */
  render?: (row: T, index: number) => ReactNode;
  /** Optional classes */
  thClassName?: string;
  tdClassName?: string;
  /** Optional width (inline) */
  width?: number | string;
  /** If true, add a 'no-sort' class (for your theme) */
  noSort?: boolean;
};

export type DataTableProps<T> = {
  /** Table headers/columns */
  columns: Column<T>[];
  /** Rows to render */
  data: T[];

  className?: string;
  tableClassName?: string;

  /** States */
  loading?: boolean;
  emptyMessage?: string;

  /** Paging (optional) */
  page?: number; // 1-based
  pageSize?: number;
  total?: number;
  onPageChange?: (nextPage: number) => void;

  /** Key extractor for rows (default: index) */
  getRowKey?: (row: T, index: number) => React.Key;

  /** Optional row click */
  onRowClick?: (row: T) => void;
};

export default function DataTable<T>({
  columns,
  data,
  className,
  tableClassName = "table datatable table-nowrap",
  loading,
  emptyMessage = "No data found.",
  page,
  pageSize,
  total,
  onPageChange,
  getRowKey,
  onRowClick,
}: DataTableProps<T>) {
  const hasPaging =
    typeof page === "number" &&
    typeof pageSize === "number" &&
    typeof total === "number";

  const totalPages = useMemo(
    () => (hasPaging ? Math.max(1, Math.ceil(total! / pageSize!)) : 1),
    [hasPaging, total, pageSize]
  );

  return (
    <div className={`table-responsive ${className ?? ""}`}>
      <table className={tableClassName}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={
                  c.noSort ? `no-sort ${c.thClassName ?? ""}` : c.thClassName
                }
                style={c.width ? { width: c.width } : undefined}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan={columns.length}>
                <div className="d-flex align-items-center gap-2 py-3">
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span>Loading…</span>
                </div>
              </td>
            </tr>
          )}

          {!loading && data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="py-4 text-muted">
                {emptyMessage}
              </td>
            </tr>
          )}

          {!loading &&
            data.map((row, rowIdx) => {
              const key = getRowKey?.(row, rowIdx) ?? rowIdx;
              return (
                <tr
                  key={key}
                  role={onRowClick ? "button" : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  style={onRowClick ? { cursor: "pointer" } : undefined}
                >
                  {columns.map((c) => (
                    <td key={c.key} className={c.tdClassName}>
                      {c.render
                        ? c.render(row, rowIdx)
                        : c.accessor
                        ? c.accessor(row)
                        : null}
                    </td>
                  ))}
                </tr>
              );
            })}
        </tbody>
      </table>

      {hasPaging && totalPages > 1 && (
        <div className="d-flex justify-content-end align-items-center gap-2 mt-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page! <= 1}
            onClick={() => onPageChange?.(page! - 1)}
          >
            Prev
          </button>
          <span className="text-muted small">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page! >= totalPages}
            onClick={() => onPageChange?.(page! + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
