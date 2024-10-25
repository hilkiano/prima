import {
  ActionIcon,
  ComboboxData,
  ComboboxItem,
  Modal,
  Paper,
  PaperProps,
  Text,
} from "@mantine/core";
import { IconBuildingStore, IconEdit, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useLocale, useTranslations } from "next-intl";
import { forwardRef } from "react";
import "dayjs/locale/id";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import ProductsBatchForm from "./ProductsBatchForm";
import { useDisclosure } from "@mantine/hooks";
import { UseQueryResult } from "@tanstack/react-query";
import { JsonResponse, ListResult } from "@/types/common.types";

type TProductBatchCard = {
  batch: {
    outlet_id: string;
    stock: string;
    is_infinite_stock: boolean;
    currency_id: number;
    base_capital_price: string;
    base_selling_price: string;
    expired_at?: Date | null | undefined;
  };
  outlets: ComboboxData;
  batchId: number;
  productForm: UseFormReturn<any, any, any>;
  varId: number;
  currency: number;
  productCurrencies: ComboboxData;
  currencyQuery: UseQueryResult<JsonResponse<ListResult<Currency[]>>, Error>;
  altCurrencyFormat: boolean;
};

const ProductBatchCard = forwardRef<
  HTMLDivElement,
  PaperProps & TProductBatchCard
>(
  (
    {
      batch,
      outlets,
      batchId,
      productForm,
      varId,
      currency,
      productCurrencies,
      currencyQuery,
      altCurrencyFormat,
      ...props
    },
    ref
  ) => {
    let outletName: string = "";
    outlets.map((outlet) => {
      const a = outlet as ComboboxItem;
      outletName = a.label;
    });

    const [opened, { open, close }] = useDisclosure(false);
    const locale = useLocale();
    const t = useTranslations("Products.Add");

    const batchesArray = useFieldArray({
      control: productForm.control,
      keyName: "batch_id",
      name: `variants.${varId}.batches`,
    });

    return (
      <>
        <Paper {...props}>
          <div className="flex gap-4 items-center mb-4 absolute top-4 left-4">
            <IconBuildingStore size={14} className="shrink-0" />
            <Text className="line-clamp-2 font-semibold text-sm">
              {outletName}
            </Text>
          </div>
          <div className="bottom-4 left-4 absolute">
            <div className="flex gap-2 items-center">
              <Text className="text-sm opacity-60">{t("label_stock")}</Text>
              <Text className="text-sm font-semibold">
                {batch.is_infinite_stock ? "∞" : batch.stock}
              </Text>
            </div>
            <div className="flex gap-2 items-center">
              <Text className="text-sm opacity-60">
                {t("label_capital_price")}
              </Text>
              <Text className="text-sm font-semibold">
                {batch.base_capital_price}
              </Text>
            </div>
            <div className="flex gap-2 items-center">
              <Text className="text-sm opacity-60">
                {t("label_selling_price")}
              </Text>
              <Text className="text-sm font-semibold">
                {batch.base_selling_price}
              </Text>
            </div>
            <div className="flex gap-2 items-center">
              <Text className="text-sm opacity-60">
                {t("label_expired_at")}
              </Text>
              <Text className="text-sm font-semibold">
                {batch.expired_at
                  ? dayjs(batch.expired_at).locale(locale).format("DD MMM YYYY")
                  : "-"}
              </Text>
            </div>
          </div>
          <div className="flex absolute top-4 right-4 gap-2">
            <ActionIcon size="sm" aria-label="edit batch button" onClick={open}>
              <IconEdit />
            </ActionIcon>
            <ActionIcon
              size="sm"
              aria-label="delete batch button"
              onClick={() => batchesArray.remove(batchId)}
            >
              <IconTrash />
            </ActionIcon>
          </div>
          <Text className="opacity-25 text-5xl absolute bottom-2 right-2">
            #{batchId + 1}
          </Text>
        </Paper>

        <Modal opened={opened} onClose={close} title={t("title_batch_form")}>
          <ProductsBatchForm
            productForm={productForm}
            varId={varId ? varId : 0}
            currency={currency}
            productCurrencies={productCurrencies}
            currencyQuery={currencyQuery}
            altCurrencyFormat={altCurrencyFormat}
            locale={locale}
            outlets={outlets}
            onClose={() => {
              close();
            }}
            data={batch}
            batchId={batchId}
          />
        </Modal>
      </>
    );
  }
);

ProductBatchCard.displayName = "ProductBatchCard";
export default ProductBatchCard;
