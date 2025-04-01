import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnResizeMode,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  getPaginationRowModel,
  Cell,
  Table as TableType,
} from "@tanstack/react-table";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  Search,
  Plus,
  MoreHorizontal,
  Calendar,
  Tag,
  Link as LinkIcon,
} from "lucide-react";
import {
  ColumnMeta,
  DataTableProps,
  EmptyStateProps,
  RowAction,
} from "@/types/DataTable.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuItemProps,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence } from "motion/react";
import { SearchInput } from "./SearchInput";
import { Skeleton } from "@/components/ui/skeleton";
import { MotionTableRow } from "../MotionTag";
import { Badge } from "@/components/ui/badge";
import { getIconForKeyword, IconType } from "@/utils/icons.utils";
import ConditionalWrapper from "../ConditionalWrapper";
import DropDownMenu from "../Dropdowns/DropDownMenu";

const DataTable = <T extends object>({
  data,
  columns,
  searchQuery = "",
  setSearchQuery,
  emptyStateProps,
  enableResizing = true,
  enableSorting = true,
  enableFiltering = true,
  enableColumnVisibility = true,
  enablePagination = false,
  onRowClick,
  rowActions = [],
  className,
  isLoading = false,
  tableId = "data-table",
  onRefresh,
}: DataTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");

  // Save column visibility to localStorage
  useEffect(() => {
    if (tableId && enableColumnVisibility) {
      const savedVisibility = localStorage.getItem(
        `table-visibility-${tableId}`,
      );
      if (savedVisibility) {
        setColumnVisibility(JSON.parse(savedVisibility));
      }
    }
  }, [tableId, enableColumnVisibility]);

  // Update localStorage when column visibility changes
  useEffect(() => {
    if (tableId && enableColumnVisibility) {
      localStorage.setItem(
        `table-visibility-${tableId}`,
        JSON.stringify(columnVisibility),
      );
    }
  }, [columnVisibility, tableId, enableColumnVisibility]);

  // Add actions column if rowActions are provided
  const tableColumns = useMemo(() => {
    if (rowActions.length === 0) return columns;

    return [
      ...columns,
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropDownMenu
            actions={
              rowActions
                .filter(
                  (action) => !action.hidden || !action.hidden(row.original),
                )
                .map((action) => ({
                  onClick: () => action.onClick(row.original),
                  disabled: action.disabled
                    ? action.disabled(row.original)
                    : false,

                  children: (
                    <div
                      className={`flex items-center gap-2 text-xs ${
                        action.variant === "destructive"
                          ? "!text-red-600 focus:!bg-red-50 focus:!text-red-600"
                          : ""
                      }`}
                    >
                      {action.label}
                    </div>
                  ),
                })) as DropdownMenuItemProps[]
            }
            dropdownTrigger={
              <Button
                variant="ghost"
                icon="moreHorizontal"
                className="h-8 w-8 p-0"
                iconPlacement="left"
              />
            }
          />
        ),
        enableSorting: false,
        enableResizing: false,
        size: 10,
      },
    ];
  }, [columns, rowActions]);

  // Cell renderer based on column type
  const renderCellContent = <T extends Record<string, any>>(
    cell: Cell<T, unknown>,
  ) => {
    const columnDef = cell.column.columnDef;
    const value = cell.getValue();
    // Cast meta to our ColumnMeta type
    const meta = columnDef.meta as ColumnMeta | undefined;
    const type = meta?.type;

    if (!type) {
      return flexRender(columnDef.cell, cell.getContext());
    }

    switch (type) {
      case "date":
        return (
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            {value
              ? new Date(value as string).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : flexRender(columnDef.cell, cell.getContext())}
          </div>
        );
      case "tag":
        return (
          <div className="flex items-center">
            <Badge
              variant={meta?.metaData?.variant}
              className="flex items-center"
            >
              <ConditionalWrapper show={!!meta?.metaData?.icon}>
                {getIconForKeyword(meta?.metaData?.icon!)}
              </ConditionalWrapper>
              {flexRender(columnDef.cell, cell.getContext())}
            </Badge>
          </div>
        );

      default:
        return flexRender(columnDef.cell, cell.getContext());
    }
  };

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter: searchQuery,
    },
    enableColumnResizing: enableResizing,
    columnResizeMode,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setSearchQuery,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    defaultColumn: {
      minSize: 50,
      size: 150,
      maxSize: 500,
    },
  });

  const isEmpty = table.getRowModel().rows.length === 0 && !isLoading;
  const hasInitialData = data.length > 0;
  const shouldShowSearch = enableFiltering && setSearchQuery && (hasInitialData || searchQuery);

  const EmptyState = ({
    searchText,
    defaultText,
    searchIcon,
    defaultIcon,
    searchAction,
    defaultAction,
  }: EmptyStateProps) => {
    const isFiltered = !!searchQuery;

    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-muted/80 to-muted shadow-inner">
          {isFiltered
            ? searchIcon || (
                <Search className="h-12 w-12 text-muted-foreground opacity-80" />
              )
            : defaultIcon || (
                <Plus className="h-12 w-12 text-muted-foreground opacity-80" />
              )}
        </div>
        <h3 className="text-xl font-medium text-primary/90">
          {isFiltered ? searchText : defaultText}
        </h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {isFiltered 
            ? "Try adjusting your search or filters to find what you're looking for."
            : "Get started by creating your first entry or try a different view."}
        </p>
        {isFiltered && searchAction && (
          <Button
            variant={searchAction.variant || "outline"}
            className="mt-6 shadow-sm transition-all hover:shadow"
            onClick={searchAction.onClick}
            icon={searchAction.icon as IconType}
            iconPlacement="left"
            effect="ringHover"
          >
            {searchAction.label}
          </Button>
        )}
        {!isFiltered && defaultAction && (
          <Button
            variant={defaultAction.variant || "default"}
            className="mt-6 shadow-sm transition-all hover:shadow"
            onClick={defaultAction.onClick}
            icon={defaultAction.icon as IconType}
            iconPlacement="left"
            effect="ringHover"
          >
            {defaultAction.label}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className={`data-table-container ${className || ""}`}>
      {/* Table toolbar */}
      <div className="flex items-center justify-between px-0.5 py-4">
        <div className="flex items-center gap-2">
          {shouldShowSearch && (
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
          )}
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="xs"
              className="mr-1 !text-xs"
              icon="refresh"
              iconPlacement="left"
              tooltipTitle="Refresh data"
              onClick={onRefresh}
            />
          )}
          {enableColumnVisibility && hasInitialData && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="xs"
                  className="mr-1 !text-xs"
                  icon="eyeOff"
                  iconPlacement="left"
                  tooltipTitle="Columns"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="dropdown-menu-no-close"
              >
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      onSelect={(e) => e.preventDefault()}
                      className="capitalize"
                    >
                      {column.id === "actions"
                        ? "Actions"
                        : typeof column.columnDef.header === "string"
                          ? column.columnDef.header
                          : column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Table or empty state */}
      {isEmpty ? (
        <EmptyState {...emptyStateProps} />
      ) : (
        <div className="rounded-md border">
          <div className="scrollbar-thin overflow-auto">
            <Table className="min-w-full divide-y divide-gray-200">
              <TableHeaderContent
                table={table}
                enableSorting={enableSorting}
                enableResizing={enableResizing}
              />
              <TableBodyContent
                isLoading={isLoading}
                table={table}
                onRowClick={onRowClick}
                renderCellContent={renderCellContent}
              />
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

const TableHeaderContent = <T,>({
  table,
  enableSorting,
  enableResizing,
}: {
  table: TableType<T>;
  enableSorting: boolean;
  enableResizing: boolean;
}) => {
  return (
    <AnimatePresence>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <MotionTableRow
            key={headerGroup.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: 0.2,
            }}
          >
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                style={{
                  width: header.getSize(),
                  position: "relative",
                }}
                className="rounded-md bg-background px-4 py-3"
              >
                {header.isPlaceholder ? null : (
                  <div
                    className={`flex items-center ${
                      enableSorting && header.column.getCanSort()
                        ? "cursor-pointer select-none hover:text-primary"
                        : ""
                    }`}
                    onClick={
                      enableSorting && header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {enableSorting && header.column.getCanSort() && (
                      <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground transition-transform hover:scale-110" />
                    )}
                  </div>
                )}
                {enableResizing && header.column.getCanResize() && (
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`absolute right-0 top-3 h-5 w-[3px] cursor-col-resize rounded-md bg-gray-200 ${
                      header.column.getIsResizing() ? "bg-primary" : ""
                    }`}
                  />
                )}
              </TableHead>
            ))}
          </MotionTableRow>
        ))}
      </TableHeader>
    </AnimatePresence>
  );
};

const TableBodyContent = <T,>({
  table,
  isLoading,
  onRowClick,
  renderCellContent,
}: {
  isLoading: boolean;
  table: TableType<T>;
  onRowClick?: (row: T) => void;
  renderCellContent: (cell: Cell<T, unknown>) => React.ReactNode;
}) => {
  // Use a consistent layout for both loading and data states
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        // Loading skeleton rows
        <>
          {Array.from({ length: 10 }).map((_, index) => (
            <MotionTableRow
              key={`loading-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
              className="border-b"
            >
              {table.getAllColumns().map((column) => (
                <TableCell
                  key={column.id}
                  className="px-4 py-3"
                  style={{ width: column.getSize() }}
                >
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </MotionTableRow>
          ))}
        </>
      ) : (
        // Actual data rows
        <>
          {table.getRowModel().rows.map((row) => (
            <MotionTableRow
              key={row.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
              onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              style={{
                cursor: onRowClick ? "pointer" : "default",
              }}
              className="border-b transition-all duration-200 hover:bg-muted/50 hover:shadow-sm data-[state=selected]:bg-muted"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  style={{ width: cell.column.getSize() }}
                  className="px-4 py-3"
                >
                  {renderCellContent(cell)}
                </TableCell>
              ))}
            </MotionTableRow>
          ))}
        </>
      )}
    </AnimatePresence>
  );
};

export default DataTable;
