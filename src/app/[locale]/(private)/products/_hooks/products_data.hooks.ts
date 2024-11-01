"use client";

import { generateListQueryParams } from "@/lib/helpers";
import { getList } from "@/services/list.service";
import { JsonResponse, ListResult } from "@/types/common.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ColumnFiltersState,
  ColumnSort,
  PaginationState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import { deleteFn, restoreFn } from "@/services/crud.service";

export default function useProductsData() {
  const queryClient = useQueryClient();

  // Query parameters
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ history: "push" })
  );
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10).withOptions({ history: "push" })
  );

  // Data states
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const limitOptions: string[] = ["5", "10", "20"];
  const [globalFilterColumns, setGlobalFilterColumns] = useState<string>(
    globalFilter ? "id,name,type,details" : ""
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page ? page - 1 : 0,
    pageSize: limit ? limit : 20,
  });
  const [withTrashed, setWithTrashed] = useState<boolean>(true);
  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Data query
  const dataQuery = useQuery<JsonResponse<ListResult<Product[]>>>({
    queryFn: async () => {
      return getList({
        model: "Product",
        with_trashed: "true",
        relations: "category&variants.batches",
        ...generateListQueryParams({
          pagination: pagination,
          globalFilter: globalFilter,
          globalFilterColumns: globalFilterColumns,
          withTrashed: withTrashed,
          sorting: sorting,
          columnFilters: columnFilters,
        }),
      });
    },
    queryKey: [
      "productList",
      {
        sorting,
        globalFilter,
        pagination,
        columnFilters,
        withTrashed,
      },
    ],
  });

  // Mutations
  const mutationDisable = useMutation({
    mutationFn: (data: {
      class: "Product" | "ProductVariant" | "ProductBatch";
      payload: { payload: Partial<Product> };
    }) => deleteFn(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["productList"] });
      queryClient.invalidateQueries({ queryKey: ["productData"] });
      queryClient.invalidateQueries({ queryKey: ["productStatistic"] });
    },
  });

  const mutationEnable = useMutation({
    mutationFn: (data: {
      class: "Product" | "ProductVariant" | "ProductBatch";
      payload: { payload: Partial<Product> };
    }) => restoreFn(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["productList"] });
      queryClient.invalidateQueries({ queryKey: ["productData"] });
      queryClient.invalidateQueries({ queryKey: ["productStatistic"] });
    },
  });

  useEffect(() => {
    setPagination({
      pageIndex: page - 1,
      pageSize: limit,
    });
  }, [page, limit, setPagination]);

  return {
    dataQuery,
    filters: {
      sorting,
      setSorting,
      globalFilter,
      setGlobalFilter,
      globalFilterColumns,
      setGlobalFilterColumns,
      pagination,
      setPagination,
      columnFilters,
      setColumnFilters,
      withTrashed,
      setWithTrashed,
      limitOptions,
    },
    queryParams: {
      page,
      setPage,
      limit,
      setLimit,
    },
    mutations: {
      mutationDisable,
      mutationEnable,
    },
  };
}
