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
import { forwardRef, useState } from "react";
import "dayjs/locale/id";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import ProductBatchForm from "./ProductBatchForm";
import { useDisclosure } from "@mantine/hooks";
import { UseQueryResult } from "@tanstack/react-query";
import { JsonResponse, ListResult } from "@/types/common.types";
import { useUserContext } from "@/lib/userProvider";

type TProductBatchCard = {
  batch: {
    outlet_id: string;
    stock: string;
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
  updateFn?: (data: TBatchForm) => Promise<void>;
  deleteFn?: () => void;
};

type TBatchForm = {
  base_capital_price: string;
  base_selling_price: string;
  stock: string;
  outlet_id: string;
  currency_id: number;
  expired_at?: Date | null | undefined;
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
      updateFn,
      deleteFn,
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
    const [loading, setLoading] = useState(false);
    const { userData } = useUserContext();

    const batchesArray = useFieldArray({
      control: productForm.control,
      keyName: "batch_id",
      name: `batches`,
    });

    const updateBatch = async (data: TBatchForm) => {
      if (updateFn) {
        setLoading(true);
        await updateFn(data);
        setLoading(false);
        close();
      } else {
        batchesArray.update(batchId ? batchId : 0, data);
        close();
      }
    };

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
              <Text className="text-sm font-semibold">{batch.stock}</Text>
            </div>
            <div className="flex gap-2 items-center">
              <Text className="text-sm opacity-60">
                {t("label_capital_price")}
              </Text>
              <Text className="text-sm font-semibold">
                {batch.base_capital_price ? batch.base_capital_price : "-"}
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
            {userData?.privileges.includes("DATA_UPDATE_PRODUCT_BATCH") ? (
              <ActionIcon
                size="sm"
                aria-label="edit batch button"
                onClick={open}
              >
                <IconEdit />
              </ActionIcon>
            ) : (
              <></>
            )}

            {userData?.privileges.includes("DATA_DELETE_PRODUCT_BATCH") ? (
              <ActionIcon
                size="sm"
                aria-label="delete batch button"
                onClick={
                  deleteFn ? deleteFn : () => batchesArray.remove(batchId)
                }
                color={deleteFn ? "red" : "blue"}
              >
                <IconTrash />
              </ActionIcon>
            ) : (
              <></>
            )}
          </div>
          <Text className="opacity-25 text-5xl absolute bottom-2 right-2">
            #{batchId + 1}
          </Text>
        </Paper>

        <Modal opened={opened} onClose={close} title={t("title_batch_form")}>
          <ProductBatchForm
            variantForm={productForm}
            submitFn={updateBatch}
            data={batch}
            loading={loading}
          />
        </Modal>
      </>
    );
  }
);

ProductBatchCard.displayName = "ProductBatchCard";
export default ProductBatchCard;
