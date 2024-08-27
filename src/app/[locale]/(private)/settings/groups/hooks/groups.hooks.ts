"use client";

import React from "react";
import {
  ColumnFiltersState,
  ColumnSort,
  PaginationState,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { getList } from "@/services/list.service";
import { useGlobalMessageContext } from "@/lib/globalMessageProvider";
import { generateListQueryParams } from "@/lib/helpers";

export default function useGroups() {
  const { message } = useGlobalMessageContext();
  const [sorting, setSorting] = React.useState<ColumnSort[]>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [globalFilterColumns, setGlobalFilterColumns] =
    React.useState<string>("");
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const query = useQuery<JsonResponse<ListResult<Group>>>({
    queryFn: async () => {
      return getList(message, {
        model: "Group",
        ...generateListQueryParams({
          sorting: sorting,
          globalFilter: globalFilter,
          globalFilterColumns: globalFilterColumns,
          pagination: pagination,
          columnFilters: columnFilters,
        }),
      });
    },
    queryKey: [
      "groupList",
      { sorting, globalFilter, pagination, columnFilters },
    ],
  });

  return {
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
  };
}
