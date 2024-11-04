import { Carousel } from "@mantine/carousel";
import {
  Badge,
  Box,
  BoxProps,
  Paper,
  Switch,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useLocale, useTranslations } from "next-intl";
import React, { forwardRef } from "react";
import { IconBuildingStore, IconInfinity } from "@tabler/icons-react";
import dayjs from "dayjs";

import "dayjs/locale/id";
import { useMediaQuery } from "@mantine/hooks";
import useProductsData from "../../_hooks/products_data.hooks";
import { notifications } from "@mantine/notifications";
import ProductsImageThumbnail from "./ProductsImageThumbnail";

type TProductVariants = {
  data: Product;
};

const ProductVariants = forwardRef<HTMLDivElement, BoxProps & TProductVariants>(
  ({ data, ...props }, ref) => {
    const t = useTranslations("Products");
    const locale = useLocale();
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

    const { mutations } = useProductsData();

    const handleVariantCheck = ({
      val,
      variant,
    }: {
      val: React.ChangeEvent<HTMLInputElement>;
      variant: ProductVariant;
    }) => {
      if (!val.target.checked) {
        const activeVariant =
          data.variants!.length -
          data.variants!.filter((variant) => variant.deleted_at).length;

        if (activeVariant === 1) {
          notifications.show({
            color: "yellow",
            title: t("warning_active_title"),
            message: t("warning_active_message", {
              child: t("variant"),
              parent: t("product"),
            }),
          });
        } else {
          mutations.mutationDisable.mutate({
            class: "ProductVariant",
            payload: {
              payload: {
                id: variant.id,
              },
            },
          });
        }
      } else {
        mutations.mutationEnable.mutate({
          class: "ProductVariant",
          payload: {
            payload: {
              id: variant.id,
            },
          },
        });
      }
    };

    const handleBatchCheck = ({
      val,
      variant,
      data,
    }: {
      val: React.ChangeEvent<HTMLInputElement>;
      variant: ProductVariant;
      data: ProductBatch;
    }) => {
      if (!val.target.checked) {
        const activeBatch =
          variant.batches!.length -
          variant.batches!.filter((batch) => batch.deleted_at).length;

        if (activeBatch === 1) {
          notifications.show({
            color: "yellow",
            title: t("warning_active_title"),
            message: t("warning_active_message", {
              child: t("batch"),
              parent: t("variant"),
            }),
          });
        } else {
          mutations.mutationDisable.mutate({
            class: "ProductBatch",
            payload: {
              payload: {
                id: data.id,
              },
            },
          });
        }
      } else {
        mutations.mutationEnable.mutate({
          class: "ProductBatch",
          payload: {
            payload: {
              id: data.id,
            },
          },
        });
      }
    };

    const ProductBatchCard = ({
      variant,
      data,
      id,
    }: {
      variant: ProductVariant;
      data: ProductBatch;
      id: number;
    }) => {
      return (
        <Paper className="p-4 rounded-lg bg-slate-300/70 dark:bg-slate-900/70 h-[160px] relative select-none">
          <Switch
            size="sm"
            onChange={(val) => handleBatchCheck({ val, variant, data })}
            checked={!data.deleted_at}
            classNames={{
              root: "w-fit self-end absolute top-4 right-4",
            }}
          />
          <div className="flex gap-4 items-center mb-4 absolute top-4 left-4">
            <IconBuildingStore size={14} className="shrink-0" />
            <Text className="line-clamp-2 font-semibold text-sm">
              {data.outlet?.name}
            </Text>
          </div>
          <div className="bottom-4 left-4 absolute">
            <div className="flex gap-2 items-center">
              <Text className="text-sm opacity-60">{t("Add.label_stock")}</Text>
              <Text className="text-sm font-semibold">
                {Intl.NumberFormat(locale).format(data.stock)}
              </Text>
            </div>
            <div className="flex gap-2 items-center">
              <Text className="text-sm opacity-60">
                {t("Add.label_capital_price")}
              </Text>
              {data.base_capital_price ? (
                <Text className="text-sm font-semibold">
                  {t("batch_price", {
                    currency: data.currency?.currency,
                    price: Intl.NumberFormat(locale).format(
                      data.base_capital_price
                    ),
                  })}
                </Text>
              ) : (
                <Text className="text-sm font-semibold">-</Text>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <Text className="text-sm opacity-60">
                {t("Add.label_selling_price")}
              </Text>
              <Text className="text-sm font-semibold">
                {t("batch_price", {
                  currency: data.currency?.currency,
                  price: Intl.NumberFormat(locale).format(
                    data.base_selling_price
                  ),
                })}
              </Text>
            </div>
            <div className="flex gap-2 items-center">
              <Text className="text-sm opacity-60">
                {t("Add.label_expired_at")}
              </Text>
              <Text className="text-sm font-semibold">
                {data.expired_at
                  ? dayjs(data.expired_at).locale(locale).format("DD MMM YYYY")
                  : "-"}
              </Text>
            </div>
          </div>

          <Text className="opacity-25 text-5xl absolute bottom-2 right-2">
            #{id + 1}
          </Text>
        </Paper>
      );
    };

    return (
      <Box {...props}>
        {data.variants?.map((variant, id) => (
          <div
            className="flex flex-col mb-4 border-2 border-slate-300/50 dark:border-slate-900/50 border-solid rounded-lg p-4 relative"
            key={id}
          >
            <Badge className="absolute top-4 right-4 uppercase font-bold">
              {t("variant_subhead", { number: id + 1 })}
            </Badge>
            <p className="m-0 font-bold text-sm uppercase">SKU</p>
            <p className="m-0 opacity-60 font-mono">{variant.sku}</p>

            <p className="m-0 font-bold text-sm uppercase mt-2">
              {t("Add.label_label")}
            </p>
            <p className="m-0 opacity-60">{variant.label ?? "-"}</p>
            <p className="m-0 font-bold text-sm uppercase mt-2">
              {t("Add.label_specifications")}
            </p>
            <p className="m-0 opacity-60">{variant.specifications ?? "-"}</p>

            <p className="m-0 font-bold text-sm uppercase mt-2">
              {t("Add.label_images")}
            </p>
            {variant.pictures_url ? (
              <div className="flex flex-row gap-4">
                {variant.pictures_url.map((url, index) => (
                  <ProductsImageThumbnail
                    key={index + 100}
                    image={url as string}
                    className="w-24 h-24 my-4 opacity-60 hover:opacity-100 transition-opacity cursor-pointer relative"
                  />
                ))}
              </div>
            ) : (
              <p className="m-0 opacity-60">-</p>
            )}
            <p className="m-0 font-bold text-sm uppercase mt-2">
              {t("Add.field_batch")}
            </p>
            <Carousel
              slideSize={400}
              slideGap="lg"
              slidesToScroll={1}
              containScroll="trimSnaps"
              withControls={false}
              dragFree
              classNames={{
                viewport: "mt-6",
              }}
            >
              {variant.batches?.map((batch, id) => (
                <Carousel.Slide key={id}>
                  <ProductBatchCard data={batch} variant={variant} id={id} />
                </Carousel.Slide>
              ))}
            </Carousel>
            <Switch
              size={isMobile ? "sm" : "md"}
              onChange={(val) => handleVariantCheck({ val, variant })}
              checked={!variant.deleted_at}
              classNames={{
                root: "w-fit self-end mt-8",
              }}
              label={t("active")}
            />
          </div>
        ))}
      </Box>
    );
  }
);

ProductVariants.displayName = "ProductVariants";
export default ProductVariants;
