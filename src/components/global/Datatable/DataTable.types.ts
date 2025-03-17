import { IButtonVariants } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";

// Define the column meta type
export interface ColumnMeta {
  type?: "date" | "tag" | "link";
  // Add other meta properties as needed
}

// Extend the ColumnDef type to include our custom meta
export type DataTableColumn<TData, RowValue> = ColumnDef<TData, RowValue> & {
  meta?: ColumnMeta;
};

export interface ActionButton {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: IButtonVariants;
  disabled?: boolean;
}

export interface EmptyStateProps {
  searchText: string;
  defaultText: string;
  searchIcon?: ReactNode;
  defaultIcon?: ReactNode;
  searchAction?: ActionButton;
  defaultAction?: ActionButton;
}

export interface RowAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
  variant?: IButtonVariants;
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
}

export interface DataTableProps<T extends object> {
  data: T[];
  columns: DataTableColumn<T, unknown>[];
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
  emptyStateProps: EmptyStateProps;
  enableResizing?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableRowSelection?: boolean;
  enableColumnVisibility?: boolean;
  enablePagination?: boolean;
  onRowClick?: (row: T) => void;
  rowActions?: RowAction<T>[];
  selectedRows?: T[];
  onSelectionChange?: (rows: T[]) => void;
  className?: string;
  isLoading?: boolean;
  tableId?: string;
  onRefresh?: () => void;
}
