import {
  Box,
  BoxProps,
  Button,
  Checkbox,
  ComboboxData,
  InputBase,
  Select,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { forwardRef } from "react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import useProductsBatchForm from "../_hooks/products_batch_form.hooks";
import { InputNumberFormat } from "@react-input/number-format";
import { UseQueryResult } from "@tanstack/react-query";
import { JsonResponse, ListResult } from "@/types/common.types";
import { IconCalendarDue, IconDeviceFloppy } from "@tabler/icons-react";
import { DateInput, DatesProvider } from "@mantine/dates";

type TProductsBatchForm = {
  productForm: UseFormReturn<any, any, any>;
  varId: number;
  currency: number;
  productCurrencies: ComboboxData;
  currencyQuery: UseQueryResult<JsonResponse<ListResult<Currency[]>>, Error>;
  altCurrencyFormat: boolean;
  locale: string;
  outlets: ComboboxData;
  onClose: () => void;
  data?: {
    outlet_id: string;
    stock: string;
    currency_id: number;
    base_capital_price: string;
    base_selling_price: string;
    expired_at?: Date | null | undefined;
  };
  batchId?: number;
};

const ProductsBatchForm = forwardRef<
  HTMLDivElement,
  BoxProps & TProductsBatchForm
>(
  (
    {
      productForm,
      varId,
      currency,
      productCurrencies,
      currencyQuery,
      altCurrencyFormat,
      locale,
      outlets,
      onClose,
      data,
      batchId,
      ...props
    },
    ref
  ) => {
    const { form } = useProductsBatchForm(currency, data);
    const tButton = useTranslations("Button");
    const t = useTranslations("Products.Add");

    const batchesArray = useFieldArray({
      control: productForm.control,
      keyName: "batch_id",
      name: `variants.${varId}.batches`,
    });

    return (
      <Box {...props}>
        <form
          className="flex flex-col gap-4"
          noValidate
          id="product-batch-form"
          onSubmit={form.handleSubmit((formData) => {
            if (data) {
              batchesArray.update(batchId ? batchId : 0, formData);
            } else {
              batchesArray.append(formData);
            }

            onClose();
          })}
        >
          <Controller
            name={"outlet_id"}
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <Select
                required
                label={t("label_outlet")}
                size="lg"
                className="w-full"
                data={outlets}
                error={form.formState.errors.outlet_id?.message}
                value={String(value)}
                onChange={onChange}
                allowDeselect={false}
              />
            )}
          />
          <Controller
            name={`stock`}
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <InputBase
                required
                label={t("label_stock")}
                className="w-full"
                error={form.formState.errors.stock?.message}
                autoComplete="off"
                value={value}
                onChange={onChange}
                maxLength={50}
                component={InputNumberFormat}
                locales={locale}
                variant="filled"
              />
            )}
          />
          <Controller
            name={"currency_id"}
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <Select
                label={t("label_currency")}
                className="w-full"
                data={productCurrencies}
                defaultValue={String(currency)}
                value={String(value)}
                onChange={(val) => {
                  onChange(Number(val));
                  form.resetField(`base_capital_price`);
                  form.resetField(`base_selling_price`);
                }}
                allowDeselect={false}
              />
            )}
          />
          <Controller
            name={`base_capital_price`}
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <InputBase
                label={t("label_capital_price")}
                className="w-full"
                error={form.formState.errors?.base_capital_price?.message}
                autoComplete="off"
                value={value}
                onChange={onChange}
                component={InputNumberFormat}
                locales={locale}
                variant="filled"
                format="currency"
                currency={
                  currencyQuery.data
                    ? currencyQuery.data.data.rows.find(
                        (currency) =>
                          currency.id === Number(form.watch(`currency_id`))
                      )?.currency
                    : "IDR"
                }
                currencyDisplay={altCurrencyFormat ? "symbol" : "code"}
                maximumFractionDigits={0}
              />
            )}
          />
          <Controller
            name={`base_selling_price`}
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <InputBase
                required
                label={t("label_selling_price")}
                className="w-full"
                error={form.formState.errors?.base_selling_price?.message}
                autoComplete="off"
                value={value}
                onChange={onChange}
                component={InputNumberFormat}
                locales={locale}
                variant="filled"
                format="currency"
                currency={
                  currencyQuery.data
                    ? currencyQuery.data.data.rows.find(
                        (currency) =>
                          currency.id === Number(form.watch(`currency_id`))
                      )?.currency
                    : "IDR"
                }
                currencyDisplay={altCurrencyFormat ? "symbol" : "code"}
                maximumFractionDigits={0}
              />
            )}
          />
          <Controller
            name={`expired_at`}
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <DatesProvider settings={{ locale: locale }}>
                <DateInput
                  label={t("label_expired_at")}
                  leftSection={<IconCalendarDue />}
                  clearable
                  minDate={new Date()}
                  variant="filled"
                  value={value}
                  onChange={onChange}
                  valueFormat="DD MMMM YYYY"
                />
              </DatesProvider>
            )}
          />
          <Button
            className="mt-6 self-end"
            variant="filled"
            leftSection={<IconDeviceFloppy />}
            type="submit"
          >
            {tButton("save")}
          </Button>
        </form>
      </Box>
    );
  }
);

ProductsBatchForm.displayName = "ProductsBatchForm";
export default ProductsBatchForm;
