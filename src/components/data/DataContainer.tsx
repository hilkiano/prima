"use client";

import { JsonResponse, ListResult } from "@/types/common.types";
import {
  ActionIcon,
  Box,
  BoxProps,
  Center,
  Table,
  useMantineTheme,
} from "@mantine/core";
import { UseQueryResult } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ColumnSort,
  getCoreRowModel,
  PaginationState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import React, {
  Dispatch,
  forwardRef,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
} from "react";
import DataTableHeader from "./DataTableHeader";
import DataTableBody from "./DataTableBody";
import Paginator from "./Paginator";
import ColumnVisibilityToggle from "./ColumnVisibilityToggle";
import SearchBar from "./SearchBar";
import { IconSearch } from "@tabler/icons-react";
import { NotFoundSvg } from "../Svgs";
import { useMediaQuery, useStateHistory } from "@mantine/hooks";
import { Options } from "nuqs";
import { filter } from "lodash";

type TDataContainer = {
  dataQuery: UseQueryResult<JsonResponse<ListResult<any>>, Error>;
  withPaginator?: boolean;
  filters?: {
    sorting: ColumnSort[];
    setSorting: Dispatch<SetStateAction<ColumnSort[]>>;
    globalFilter: string;
    setGlobalFilter: Dispatch<SetStateAction<string>>;
    globalFilterColumns: string;
    setGlobalFilterColumns: Dispatch<SetStateAction<string>>;
    pagination: PaginationState;
    setPagination: Dispatch<SetStateAction<PaginationState>>;
    columnFilters: ColumnFiltersState;
    setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
    withTrashed: boolean;
    setWithTrashed: Dispatch<SetStateAction<boolean>>;
    limitOptions: string[];
  };
  columns: ColumnDef<any, any>[];
  queryParams: {
    page: number;
    setPage: (
      value: number | ((old: number) => number | null) | null,
      options?: Options
    ) => Promise<URLSearchParams>;
    limit: number;
    setLimit: (
      value: number | ((old: number) => number | null) | null,
      options?: Options
    ) => Promise<URLSearchParams>;
  };
  model: string;
};

const DataContainer = forwardRef<HTMLDivElement, BoxProps & TDataContainer>(
  (
    {
      dataQuery,
      withPaginator,
      filters,
      columns,
      model,
      queryParams,
      ...props
    },
    ref
  ) => {
    const t = useTranslations("Data");
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

    const searchBarRef = useRef<{ getValue: () => string | undefined }>(null);
    const handleSearchClick = () => {
      const value = searchBarRef.current?.getValue();

      table.setPageIndex(0);
      table.setGlobalFilter(value);
    };

    const tableData: any = useMemo(
      () => dataQuery.data?.data.rows ?? [],
      [dataQuery]
    );

    const [columnPinning, setColumnPinning] =
      React.useState<ColumnPinningState>({
        left: [],
        right: ["action"],
      });

    const table = useReactTable({
      data: tableData,
      columns,
      state: {
        sorting: filters ? filters.sorting : undefined,
        globalFilter: filters ? filters.globalFilter : undefined,
        pagination: filters ? filters.pagination : undefined,
        columnPinning,
      },
      getCoreRowModel: getCoreRowModel(),
      onSortingChange: filters ? filters.setSorting : undefined,
      onGlobalFilterChange: filters ? filters.setGlobalFilter : undefined,
      onPaginationChange: filters ? filters.setPagination : undefined,
      onColumnPinningChange: setColumnPinning,
      manualSorting: true,
      manualFiltering: true,
      manualPagination: true,
      pageCount: dataQuery.data ? dataQuery.data.data.page_count : 1,
    });

    return (
      <Box {...props}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col xs:flex-row justify-between items-center gap-4">
            <ColumnVisibilityToggle
              table={table}
              model={model}
              className="w-full xs:w-auto"
            />
            <SearchBar
              ref={searchBarRef}
              table={table}
              dataQuery={dataQuery}
              className="w-full xs:w-[260px]"
              onSearch={handleSearchClick}
              rightSection={
                <ActionIcon
                  radius="xl"
                  onClick={handleSearchClick}
                  aria-label={t("aria_search")}
                >
                  <IconSearch size={16} />
                </ActionIcon>
              }
            />
          </div>

          {dataQuery.data?.data.rows.length === 0 &&
          filters?.globalFilter !== "" ? (
            <Center className="my-12">
              <div className="max-w-[400px] flex flex-col items-center gap-4">
                <NotFoundSvg
                  width={isMobile ? 100 : 150}
                  height={isMobile ? 100 : 150}
                />
                <h1 className="text-xl md:text-3xl m-0 opacity-50 text-center">
                  {t("not_found", {
                    search: filters?.globalFilter,
                  })}
                </h1>
              </div>
            </Center>
          ) : dataQuery.data?.data.rows.length === 0 &&
            filters?.globalFilter === "" ? (
            <Center className="my-12">
              <div className="max-w-[400px] flex flex-col items-center gap-4">
                <NotFoundSvg
                  width={isMobile ? 100 : 150}
                  height={isMobile ? 100 : 150}
                />
                <h1 className="text-xl md:text-3xl m-0 opacity-50 text-center">
                  {t("no_data")}
                </h1>
              </div>
            </Center>
          ) : (
            <div className="relative overflow-x-auto shadow-md rounded-md [&>div]:pb-0">
              <div className="block w-full overflow-x-auto">
                <Table
                  layout="fixed"
                  className={`border-spacing-0 w-full min-w-[${table.getTotalSize()}px]`}
                >
                  <DataTableHeader table={table} />
                  <DataTableBody table={table} />
                </Table>
              </div>
            </div>
          )}

          {filters && dataQuery.data?.data.rows.length > 0 ? (
            <Paginator
              dataQuery={dataQuery}
              showLimitSelector
              pagination={filters.pagination}
              setPagination={filters.setPagination}
              limitOptions={filters.limitOptions}
              queryParams={queryParams}
            />
          ) : (
            <></>
          )}
        </div>
      </Box>
    );
  }
);

DataContainer.displayName = "DataContainer";
export default DataContainer;
