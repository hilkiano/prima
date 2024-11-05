"use client";

import { ActionIcon, Badge, Box, BoxProps, Menu, Tooltip } from "@mantine/core";
import { useLocale, useTranslations } from "next-intl";
import { forwardRef, useEffect, useMemo } from "react";
import useProductsData from "../_hooks/products_data.hooks";
import DataContainer from "@/components/data/DataContainer";
import { createColumnHelper } from "@tanstack/react-table";
import {
  IconDotsVertical,
  IconEye,
  IconInfinity,
  IconPencil,
  IconRestore,
  IconTrash,
} from "@tabler/icons-react";
import { sumMultiDimensionalArray } from "@/lib/helpers";
import { modals } from "@mantine/modals";
import { Link } from "@/i18n/routing";
import { useUserContext } from "@/lib/userProvider";

const ProductsDataContainer = forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const tButton = useTranslations("Button");
    const tData = useTranslations("Data");
    const t = useTranslations("Products");
    const { dataQuery, filters, mutations, queryParams } = useProductsData();
    const locale = useLocale();
    const { userData } = useUserContext();

    // Prepare column for table
    const columnHelper = createColumnHelper<
      Product & { action: any; total_variant: any; total_stock: any }
    >();
    const columns = useMemo(() => {
      const deleteFn = (data: Product) => {
        modals.openConfirmModal({
          centered: true,
          size: "lg",
          title: t("modal_disable_title"),
          labels: {
            confirm: tButton("yes"),
            cancel: tButton("no"),
          },
          children: <p className="m-0">{t("modal_disable_body")}</p>,
          onCancel: () => {},
          onConfirm: () => {
            mutations.mutationDisable.mutate({
              class: "Product",
              payload: {
                payload: {
                  id: data.id,
                },
              },
            });
          },
        });
      };
      const restoreFn = (data: Product) => {
        modals.openConfirmModal({
          centered: true,
          size: "lg",
          title: t("modal_enable_title"),
          labels: {
            confirm: tButton("yes"),
            cancel: tButton("no"),
          },
          children: <p className="m-0">{t("modal_enable_body")}</p>,
          onCancel: () => {},
          onConfirm: () => {
            mutations.mutationEnable.mutate({
              class: "Product",
              payload: {
                payload: {
                  id: data.id,
                },
              },
            });
          },
        });
      };

      return [
        columnHelper.accessor("id", {
          cell: (info) => (
            <p className="truncate m-0 font-mono">{info.getValue()}</p>
          ),
          header: () => <span>{tData("Table.Columns.Product.id")}</span>,
          id: "id",
          size: 100,
          enableSorting: false,
          enableGlobalFilter: true,
          enableHiding: true,
        }),
        columnHelper.accessor("name", {
          cell: (info) => (
            <p className="truncate m-0 font-bold">{info.getValue()}</p>
          ),
          header: () => <span>{tData("Table.Columns.Product.name")}</span>,
          id: "name",
          size: 200,
          enableSorting: true,
          enableGlobalFilter: true,
          enableHiding: false,
        }),
        columnHelper.accessor("total_stock", {
          cell: (info) => {
            const getStocks = info.row.original.variants!.map((variant) => {
              return variant.batches!.map((batch) => {
                return batch.deleted_at ? 0 : batch.stock;
              });
            });

            const totalStock = sumMultiDimensionalArray(getStocks);

            return (
              <p className="m-0 font-bold">
                {Intl.NumberFormat(locale).format(totalStock)}
              </p>
            );
          },
          header: () => (
            <span className="text-right">
              {tData("Table.Columns.Product.total_stock")}
            </span>
          ),
          id: "total_stock",
          size: 100,
          enableSorting: false,
          enableGlobalFilter: false,
          enableHiding: false,
        }),
        columnHelper.accessor("total_variant", {
          cell: (info) => {
            const totalVariant = info.row.original.variants!.length;
            return (
              <p className="m-0">
                {Intl.NumberFormat(locale).format(totalVariant)}
              </p>
            );
          },
          header: () => (
            <span>{tData("Table.Columns.Product.total_variant")}</span>
          ),
          id: "total_variant",
          size: 100,
          enableSorting: false,
          enableGlobalFilter: false,
          enableHiding: false,
        }),
        columnHelper.accessor("details", {
          cell: (info) => (
            <p className="line-clamp-3 m-0">{info.getValue() ?? "-"}</p>
          ),
          header: () => <span>{tData("Table.Columns.Product.details")}</span>,
          id: "details",
          size: 200,
          enableSorting: true,
          enableGlobalFilter: true,
          enableHiding: true,
        }),
        columnHelper.accessor("action", {
          id: "action",
          cell: (info) => {
            return (
              <div className="flex justify-center">
                <Menu keepMounted shadow="md" width={220}>
                  <Menu.Target>
                    <Tooltip openDelay={500} label={tData("Action.tooltip")}>
                      <ActionIcon
                        variant="filled"
                        radius="xl"
                        aria-label="action"
                      >
                        <IconDotsVertical size={14} />
                      </ActionIcon>
                    </Tooltip>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item
                      component={Link}
                      href={`/products/${info.row.original.id}`}
                      leftSection={<IconEye size={20} />}
                    >
                      {tData("Action.view")}
                    </Menu.Item>
                    {userData?.privileges.includes("DATA_UPDATE_PRODUCT") ? (
                      <Menu.Item
                        component={Link}
                        href={`/products/update/${info.row.original.id}`}
                        leftSection={<IconPencil size={20} />}
                        disabled={!!info.row.original.deleted_at}
                      >
                        {tData("Action.update")}
                      </Menu.Item>
                    ) : (
                      <></>
                    )}
                    {userData?.privileges.includes("DATA_DELETE_PRODUCT") ? (
                      !info.row.original.deleted_at ? (
                        <Menu.Item
                          onClick={() => deleteFn(info.row.original)}
                          leftSection={<IconTrash size={20} />}
                        >
                          {tData("Action.disable")}
                        </Menu.Item>
                      ) : (
                        <Menu.Item
                          onClick={() => restoreFn(info.row.original)}
                          leftSection={<IconRestore size={20} />}
                        >
                          {tData("Action.enable")}
                        </Menu.Item>
                      )
                    ) : (
                      <></>
                    )}
                  </Menu.Dropdown>
                </Menu>
              </div>
            );
          },
          header: () => <span>&nbsp;</span>,
          size: 50,
          enableSorting: false,
          enableGlobalFilter: false,
          enableHiding: false,
        }),
      ];
    }, [
      columnHelper,
      locale,
      t,
      tData,
      tButton,
      mutations,
      userData?.privileges,
    ]);

    useEffect(() => {
      const globalFilteredColumns = columns.filter(
        (column) => column.enableGlobalFilter
      );
      filters.setGlobalFilterColumns(
        globalFilteredColumns.map((column) => column.id).join(",")
      );
    }, [columns, filters]);

    return (
      <Box {...props}>
        <DataContainer
          className="mt-4"
          dataQuery={dataQuery}
          filters={filters}
          queryParams={queryParams}
          columns={columns}
          model="Product"
          withPaginator
        />
      </Box>
    );
  }
);

ProductsDataContainer.displayName = "ProductsDataContainer";
export default ProductsDataContainer;
