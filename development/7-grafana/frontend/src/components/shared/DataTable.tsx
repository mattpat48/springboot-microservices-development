import type { ReactNode } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  className?: string;
  cell: (row: T) => ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  isLoading,
  emptyState,
  getRowKey,
}: {
  columns: Column<T>[];
  rows: T[];
  isLoading: boolean;
  emptyState: ReactNode;
  getRowKey?: (row: T, index: number) => string | number;
}) {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex gap-4 border-b p-4 last:border-0">
            {columns.map((column) => (
              <Skeleton key={column.header} className="h-5 flex-1" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (rows.length === 0) return <>{emptyState}</>;

  return (
    <div className="rounded-lg border bg-white shadow-soft">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead key={column.header} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={getRowKey ? getRowKey(row, index) : index}>
              {columns.map((column) => (
                <TableCell key={column.header} className={cn("min-w-28", column.className)}>
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
