import { JsonResponse, ListResult } from "@/types/common.types";
import {
  Box,
  BoxProps,
  Group,
  Pagination,
  Select,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import { UseQueryResult } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { Options } from "nuqs";
import React, { Dispatch, forwardRef, SetStateAction } from "react";

type TPaginator = {
  dataQuery: UseQueryResult<JsonResponse<ListResult<any>>, Error>;
  showLimitSelector?: boolean;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  limitOptions?: string[];
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
};

const Paginator = forwardRef<HTMLDivElement, BoxProps & TPaginator>(
  (
    {
      dataQuery,
      showLimitSelector = false,
      pagination,
      setPagination,
      limitOptions,
      queryParams,
      ...props
    },
    ref
  ) => {
    const t = useTranslations("Data");
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

    return (
      <Box {...props}>
        <div className="flex justify-between w-full self-end">
          {showLimitSelector ? (
            <div className="flex flex-row gap-2 items-center">
              <p className="m-0">{t("limit")}</p>
              <Select
                disabled={dataQuery.isLoading}
                variant="filled"
                size="sm"
                value={pagination.pageSize.toString()}
                data={limitOptions ?? []}
                checkIconPosition="left"
                placeholder="Limit"
                className="w-[80px]"
                radius="xl"
                withCheckIcon={false}
                onChange={(val) => {
                  queryParams.setLimit(Number(val));
                  queryParams.setPage(1);
                }}
              />
            </div>
          ) : (
            <></>
          )}
          {isMobile ? (
            <Pagination.Root
              onChange={(page) => {
                setPagination({
                  pageIndex: page - 1,
                  pageSize: pagination.pageSize,
                });
              }}
              total={dataQuery.data ? dataQuery.data.data.page_count : 0}
            >
              <Group gap={7}>
                <Pagination.Previous
                  aria-label={t("aria_previous")}
                  icon={IconChevronLeft}
                />
                <Pagination.Next
                  aria-label={t("aria_next")}
                  icon={IconChevronRight}
                />
              </Group>
            </Pagination.Root>
          ) : (
            <Pagination
              onChange={(page) => {
                queryParams.setPage(page);
              }}
              total={dataQuery.data ? dataQuery.data.data.page_count : 0}
              getControlProps={(control) => {
                if (control === "first") {
                  return {
                    "aria-label": t("aria_first"),
                  };
                }
                if (control === "last") {
                  return {
                    "aria-label": t("aria_last"),
                  };
                }
                if (control === "next") {
                  return {
                    "aria-label": t("aria_next"),
                  };
                }
                if (control === "previous") {
                  return {
                    "aria-label": t("aria_previous"),
                  };
                }
                return {};
              }}
              value={dataQuery.data?.data.page}
              nextIcon={IconChevronRight}
              previousIcon={IconChevronLeft}
              lastIcon={IconChevronsRight}
              firstIcon={IconChevronsLeft}
              withEdges
            />
          )}
        </div>
      </Box>
    );
  }
);

Paginator.displayName = "Paginator";
export default Paginator;
