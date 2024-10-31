import {
  MantineColorScheme,
  Table as MTable,
  TableTbodyProps,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
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

const DataTableBody = forwardRef<
  HTMLDivElement,
  TableTbodyProps & TDataTableHeader
>(({ table, ...props }, ref) => {
  const colorScheme = useColorScheme();

  return (
    <MTable.Tbody {...props}>
      {table.getRowModel().rows.map((row) => {
        return (
          <MTable.Tr
            className={`${
              row.original.deleted_at
                ? "bg-red-500/50 hover:bg-red-500/60 font-semibold"
                : "dark:hover:bg-slate-700/20 hover:bg-slate-300/20 font-semibold"
            }`}
            key={row.id}
          >
            {row.getVisibleCells().map((cell) => {
              const { column } = cell;
              const isPinned = column.getIsPinned();
              return (
                <MTable.Td
                  key={cell.id}
                  style={{
                    ...getCommonPinningStyles(column, colorScheme),
                  }}
                  className={`${
                    isPinned ? "bg-slate-50 dark:bg-slate-800" : ""
                  }`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </MTable.Td>
              );
            })}
          </MTable.Tr>
        );
      })}
    </MTable.Tbody>
  );
});

DataTableBody.displayName = "DataTableBody";
export default DataTableBody;
