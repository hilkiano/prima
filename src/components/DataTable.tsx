"use client";

import {
  Box,
  Button,
  Checkbox,
  MantineColorScheme,
  Table as MantineTable,
  Menu,
  TableProps,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import {
  Column,
  ColumnDef,
  ColumnPinningState,
  flexRender,
  getCoreRowModel,
  Table,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React, { CSSProperties } from "react";
import Paginator from "./Paginator";
import {
  IconArrowsSort,
  IconCaretDownFilled,
  IconFilterFilled,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";

type TDataTable = {
  tableState: any;
  columns: ColumnDef<any, any>[];
  visibilityState?: VisibilityState;
  additionalFilterComponent?: React.ReactNode;
  openAdditionalFilter?: () => void;
  minWidth: number;
} & (
  | {
      additionalFilterComponent: React.ReactNode;
      openAdditionalFilter: () => void;
    }
  | { additionalFilterComponent?: undefined; openAdditionalFilter?: undefined }
);

const getCommonPinningStyles = (
  column: Column<any>,
  colorScheme: MantineColorScheme
): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  return {
    boxShadow: isLastLeftPinnedColumn
      ? "-4px 0 4px -4px gray inset"
      : isFirstRightPinnedColumn
      ? "4px 0 4px -4px gray inset"
      : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};

const DataTableHeader = (
  table: Table<any>,
  colorScheme: MantineColorScheme
) => {
  return (
    <MantineTable.Thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <MantineTable.Tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const { column } = header;
            const isPinned = column.getIsPinned();
            return (
              <MantineTable.Th
                key={header.id}
                colSpan={header.colSpan}
                style={{
                  ...getCommonPinningStyles(column, colorScheme),
                  width: header.column.getSize(),
                }}
                className={`${
                  header.column.getCanSort() ? "cursor-pointer" : ""
                } ${
                  isPinned
                    ? "bg-slate-100 dark:bg-slate-700 "
                    : "bg-slate-100 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`flex gap-1 items-center justify-between group`}
                  onClick={() =>
                    header.column.getCanSort()
                      ? header.column.toggleSorting()
                      : undefined
                  }
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getCanSort() ? (
                    header.column.getIsSorted() ? (
                      header.column.getIsSorted() === "asc" ? (
                        <IconSortAscending size={16} />
                      ) : (
                        <IconSortDescending size={16} />
                      )
                    ) : (
                      <IconArrowsSort
                        size={16}
                        className={`opacity-0 group-hover:opacity-50 transition-opacity`}
                      />
                    )
                  ) : (
                    <></>
                  )}
                </div>
              </MantineTable.Th>
            );
          })}
        </MantineTable.Tr>
      ))}
    </MantineTable.Thead>
  );
};

const DataTableColumnToggle = (table: Table<any>) => {
  const tColumns = useTranslations("Groups.Columns");
  const t = useTranslations("DataTable");
  return (
    <Menu keepMounted shadow="md" width={200}>
      <Menu.Target>
        <Button
          variant="outline"
          rightSection={<IconCaretDownFilled size={14} />}
          className="w-full xs:w-auto"
        >
          {t("column_visibility_toggle")}
        </Button>
      </Menu.Target>

      <Menu.Dropdown className="p-4">
        <div className="flex flex-col gap-2">
          <Checkbox
            checked={table.getIsAllColumnsVisible()}
            onChange={table.getToggleAllColumnsVisibilityHandler()}
            label={t("toggle_all")}
          />
          <Menu.Divider />
          {table
            .getAllLeafColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <Checkbox
                  key={column.id}
                  className="mb-2"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                  label={tColumns(column.id)}
                />
              );
            })}
        </div>
      </Menu.Dropdown>
    </Menu>
  );
};

const DataTable = React.forwardRef<HTMLDivElement, TDataTable & TableProps>(
  (
    {
      tableState,
      columns,
      minWidth,
      visibilityState,
      additionalFilterComponent,
      openAdditionalFilter,
      ...props
    },
    ref
  ) => {
    const t = useTranslations("DataTable");
    const { colorScheme } = useMantineColorScheme();
    const data = React.useMemo(
      () => tableState.query.data?.data.rows ?? [],
      [tableState.query]
    );
    const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>(visibilityState ?? {});
    const [columnPinning, setColumnPinning] =
      React.useState<ColumnPinningState>({
        left: [],
        right: ["action"],
      });
    const table = useReactTable({
      data,
      columns,
      state: {
        sorting: tableState.sorting,
        globalFilter: tableState.globalFilter,
        pagination: tableState.pagination,
        columnVisibility,
        columnPinning,
      },
      getCoreRowModel: getCoreRowModel(),
      onSortingChange: tableState.setSorting,
      onGlobalFilterChange: tableState.setGlobalFilter,
      onPaginationChange: tableState.setPagination,
      onColumnVisibilityChange: setColumnVisibility,
      onColumnPinningChange: setColumnPinning,
      manualSorting: true,
      manualFiltering: true,
      manualPagination: true,
      pageCount: tableState.query.data
        ? tableState.query.data.data.page_count
        : 1,
    });

    return (
      <Box className="flex flex-col gap-4">
        <div className="flex gap-4 flex-col xs:flex-row justify-between items-start xs:items-center">
          <div className="flex flex-col xs:flex-row gap-4 w-full items-center">
            {DataTableColumnToggle(table)}
            {additionalFilterComponent ? (
              <>
                {additionalFilterComponent}
                <Button
                  variant="filled"
                  leftSection={<IconFilterFilled size={14} />}
                  className="w-full xs:w-auto"
                  onClick={() => openAdditionalFilter()}
                >
                  {t("additional_filter")}
                </Button>
              </>
            ) : (
              <></>
            )}
          </div>

          <TextInput
            radius="xl"
            className="w-full xs:w-[300px]"
            rightSection={<IconSearch size={16} />}
            placeholder={t("search")}
            onBlur={(e) => {
              table.setPageIndex(0);
              table.setGlobalFilter(e.target.value);
            }}
            disabled={tableState.query.isLoading}
          />
        </div>

        <MantineTable.ScrollContainer
          className="relative overflow-x-auto shadow-md rounded-md [&>div]:pb-0"
          minWidth={minWidth ? minWidth : 1000}
        >
          <MantineTable layout="fixed" {...props} highlightOnHover>
            {DataTableHeader(table, colorScheme)}
            <MantineTable.Tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <MantineTable.Tr
                    className={`dark:hover:bg-slate-700 dark:hover:bg-opacity-20 ${
                      row.original.deleted_at
                        ? "text-red-500 font-semibold"
                        : "font-semibold"
                    }`}
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const { column } = cell;
                      const isPinned = column.getIsPinned();
                      return (
                        <MantineTable.Td
                          key={cell.id}
                          style={{
                            ...getCommonPinningStyles(column, colorScheme),
                          }}
                          className={`${
                            isPinned ? "bg-slate-50 dark:bg-slate-800" : ""
                          }`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </MantineTable.Td>
                      );
                    })}
                  </MantineTable.Tr>
                );
              })}
            </MantineTable.Tbody>
          </MantineTable>
        </MantineTable.ScrollContainer>
        <Paginator
          activePage={
            tableState.query.data ? tableState.query.data.data.page : 1
          }
          totalData={
            tableState.query.data ? tableState.query.data.data.total : 0
          }
          table={table}
        />
      </Box>
    );
  }
);

DataTable.displayName = "DataTable";

export default DataTable;
