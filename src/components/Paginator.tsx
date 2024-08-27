import { Group, Pagination, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDatabase,
} from "@tabler/icons-react";
import { Table } from "@tanstack/react-table";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

type TPaginator = {
  activePage: number;
  totalData: number;
  table: Table<any>;
};

function Paginator({ activePage, totalData, table }: TPaginator) {
  const t = useTranslations("Paginator");
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const locale = useLocale();
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2 opacity-50">
        <IconDatabase />
        {new Intl.NumberFormat(locale).format(totalData)}
      </div>
      {isMobile ? (
        <Pagination.Root
          onChange={(page) => {
            table.setPageIndex(page - 1);
          }}
          total={table.getPageCount()}
        >
          <Group gap={7}>
            <Pagination.Previous icon={IconChevronLeft} />
            <Pagination.Next icon={IconChevronRight} />
          </Group>
        </Pagination.Root>
      ) : (
        <Pagination
          onChange={(page) => {
            table.setPageIndex(page - 1);
          }}
          value={activePage}
          total={table.getPageCount()}
          nextIcon={IconChevronRight}
          previousIcon={IconChevronLeft}
          lastIcon={IconChevronsRight}
          firstIcon={IconChevronsLeft}
          withEdges
        />
      )}
    </div>
  );
}

export default Paginator;
