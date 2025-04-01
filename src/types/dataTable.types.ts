import { BadgeVariants } from "@/components/ui/badge";
import { IButtonVariants } from "@/components/ui/button";
import { IconType } from "@/utils/icons.utils";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";

type ITagMetaData = {
  icon?: IconType;
  variant?: BadgeVariants;
};

type IDateMetaData = {
  format?: string;
};

export type ColumnMeta =
  | { type: "tag"; metaData?: ITagMetaData }
  | { type: "date"; metaData?: IDateMetaData };
// Extend the ColumnDef type to include our custom meta
export type DataTableColumn<TData, RowValue> = ColumnDef<TData, RowValue> & {
  meta?: ColumnMeta;
};

export interface ActionButton {
  label: string;
  icon?: IconType;
  onClick: () => void;
  variant?: IButtonVariants;
  disabled?: boolean;
}

export interface EmptyStateProps {
  searchText?: string;
  defaultText?: string;
  searchIcon?: ReactNode;
  defaultIcon?: ReactNode;
  searchAction?: ActionButton;
  defaultAction?: ActionButton;
}

export interface RowAction<T> {
  label: string;
  icon?: IconType;
  onClick: (row: T) => void;
  variant?: IButtonVariants;
  className?: string;
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
}

export interface DataTableProps<T extends object> {
  data: T[];
  columns: DataTableColumn<T, unknown>[];
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
  emptyStateProps?: EmptyStateProps;
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
