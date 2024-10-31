import {
  MantineColorScheme,
  Table as MTable,
  TableTheadProps,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import {
  IconArrowsSort,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { Column, flexRender, Table } from "@tanstack/react-table";
import React, { CSSProperties, forwardRef } from "react";

type TDataTableHeader = {
  table: Table<any>;
};

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

const DataTableHeader = forwardRef<
  HTMLDivElement,
  TableTheadProps & TDataTableHeader
>(({ table, ...props }, ref) => {
  const colorScheme = useColorScheme();
  return (
    <MTable.Thead {...props}>
      {table.getHeaderGroups().map((headerGroup) => (
        <MTable.Tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const { column } = header;
            const isPinned = column.getIsPinned();
            return (
              <MTable.Th
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
              </MTable.Th>
            );
          })}
        </MTable.Tr>
      ))}
    </MTable.Thead>
  );
});

DataTableHeader.displayName = "DataTableHeader";
export default DataTableHeader;
