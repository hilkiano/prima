"use client";

import { ActionIcon, BoxProps, ThemeIcon } from "@mantine/core";
import React from "react";
import useGroups from "../hooks/groups.hooks";
import DataTable from "@/components/DataTable";
import { createColumnHelper, VisibilityState } from "@tanstack/react-table";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { useLocale, useTranslations } from "next-intl";
import { IconDotsVertical, IconKey } from "@tabler/icons-react";

const GroupDataTable = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const locale = useLocale();
    const t = useTranslations("Groups");
    const {
      query,
      sorting,
      setSorting,
      globalFilter,
      setGlobalFilter,
      setGlobalFilterColumns,
      pagination,
      setPagination,
      columnFilters,
      setColumnFilters,
    } = useGroups();

    const columnHelper = createColumnHelper<Group & { action: any }>();
    const columns = React.useMemo(
      () => [
        columnHelper.accessor("id", {
          id: "id",
          cell: (info) => <p className="truncate m-0">{info.getValue()}</p>,
          header: () => <span>{t("Columns.id")}</span>,
          size: 200,
          enableSorting: false,
          enableGlobalFilter: true,
          enableHiding: true,
        }),
        columnHelper.accessor("name", {
          id: "name",
          cell: (info) => <p className="truncate m-0">{info.getValue()}</p>,
          header: () => <span>{t("Columns.name")}</span>,
          size: 200,
          enableSorting: true,
          enableGlobalFilter: true,
          enableHiding: false,
        }),
        columnHelper.accessor("description", {
          id: "description",
          cell: (info) => (info.getValue() ? info.getValue() : "-"),
          header: () => <span>{t("Columns.description")}</span>,
          size: 350,
          enableSorting: true,
          enableGlobalFilter: true,
          enableHiding: true,
        }),
        columnHelper.accessor("privileges", {
          id: "privileges",
          cell: (info) => {
            const countPrivileges = info.getValue().length;
            return (
              <div className="flex gap-2 items-center">
                <ThemeIcon radius="xl" size="sm">
                  <IconKey size={12} className="opacity-60" />
                </ThemeIcon>
                {new Intl.NumberFormat(locale).format(countPrivileges)}
              </div>
            );
          },
          header: () => <span>{t("Columns.privileges")}</span>,
          size: 100,
          enableSorting: false,
          enableGlobalFilter: false,
          enableHiding: false,
        }),
        columnHelper.accessor("created_at", {
          id: "created_at",
          cell: (info) =>
            dayjs(info.getValue()).locale(locale).format("YYYY-MM-DD HH:mm:ss"),
          header: () => <span>{t("Columns.created_at")}</span>,
          size: 200,
          enableSorting: true,
          enableGlobalFilter: false,
          enableHiding: true,
        }),
        columnHelper.accessor("updated_at", {
          id: "updated_at",
          cell: (info) =>
            dayjs(info.getValue()).locale(locale).format("YYYY-MM-DD HH:mm:ss"),
          header: () => <span>{t("Columns.updated_at")}</span>,
          size: 200,
          enableSorting: true,
          enableGlobalFilter: false,
          enableHiding: true,
        }),
        columnHelper.accessor("action", {
          id: "action",
          cell: () => {
            return (
              <div className="flex justify-center">
                <ActionIcon variant="filled" radius="xl" aria-label="action">
                  <IconDotsVertical size={14} />
                </ActionIcon>
              </div>
            );
          },
          header: () => <span>&nbsp;</span>,
          size: 50,
          enableSorting: false,
          enableGlobalFilter: false,
          enableHiding: false,
        }),
      ],
      [columnHelper, locale, t]
    );

    const defaultVisibility: VisibilityState = {};

    React.useEffect(() => {
      const globalFilteredColumns = columns.filter(
        (column) => column.enableGlobalFilter
      );
      setGlobalFilterColumns(
        globalFilteredColumns.map((column) => column.id).join(",")
      );
    }, [columns, setGlobalFilterColumns]);

    return (
      <>
        <DataTable
          query={query}
          columns={columns}
          sorting={sorting}
          setSorting={setSorting}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          pagination={pagination}
          setPagination={setPagination}
          visibilityState={defaultVisibility}
          minWidth={1300}
        />
      </>
    );
  }
);

GroupDataTable.displayName = "GroupDataTable";

export default GroupDataTable;
