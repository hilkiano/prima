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
import { JsonResponse, ListResult } from "@/types/common.types";

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
  const [withTrashed, setWithTrashed] = React.useState<boolean>(true);

  const query = useQuery<JsonResponse<ListResult<Group>>>({
    queryFn: async () => {
      return getList(message, {
        model: "Group",
        relation_count: "users",
        ...generateListQueryParams({
          sorting: sorting,
          globalFilter: globalFilter,
          globalFilterColumns: globalFilterColumns,
          pagination: pagination,
          columnFilters: columnFilters,
          withTrashed: withTrashed,
        }),
      });
    },
    queryKey: [
      "groupList",
      { sorting, globalFilter, pagination, columnFilters, withTrashed },
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
    withTrashed,
    setWithTrashed,
  };
}
