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
import React, { Dispatch, forwardRef, SetStateAction } from "react";

type TPaginator = {
  dataQuery: UseQueryResult<JsonResponse<ListResult<any>>, Error>;
  showLimitSelector?: boolean;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  limitOptions?: string[];
};

const Paginator = forwardRef<HTMLDivElement, BoxProps & TPaginator>(
  (
    {
      dataQuery,
      showLimitSelector = false,
      pagination,
      setPagination,
      limitOptions,
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
                  setPagination({
                    pageIndex: 0,
                    pageSize: Number(val),
                  });
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
                <Pagination.Previous icon={IconChevronLeft} />
                <Pagination.Next icon={IconChevronRight} />
              </Group>
            </Pagination.Root>
          ) : (
            <Pagination
              onChange={(page) => {
                setPagination({
                  pageIndex: page - 1,
                  pageSize: pagination.pageSize,
                });
              }}
              total={dataQuery.data ? dataQuery.data.data.page_count : 0}
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
