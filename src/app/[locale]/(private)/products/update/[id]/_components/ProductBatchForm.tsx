import { Box, BoxProps, Button, InputBase, Select } from "@mantine/core";
import React, { forwardRef } from "react";
import useProductsBatchForm from "../_hooks/products_batch_form.hooks";
import { Controller, UseFormReturn } from "react-hook-form";
import { IconCalendarDue, IconDeviceFloppy } from "@tabler/icons-react";
import { DateInput, DatesProvider } from "@mantine/dates";
import { useLocale, useTranslations } from "next-intl";
import useProductUpdate from "../_hooks/product_update.hooks";
import { InputNumberFormat } from "@react-input/number-format";

type TProductsBatchForm = {
  variantForm: UseFormReturn<any, any, any>;
  submitFn: (data: {
    base_capital_price: string;
    base_selling_price: string;
    stock: string;
    outlet_id: string;
    currency_id: number;
    expired_at?: Date | null | undefined;
  }) => void;
  data?: {
    outlet_id: string;
    stock: string;
    currency_id: number;
    base_capital_price: string;
    base_selling_price: string;
    expired_at?: Date | null | undefined;
  };
  loading?: boolean;
};

const ProductBatchForm = forwardRef<
  HTMLDivElement,
  BoxProps & TProductsBatchForm
>(({ variantForm, submitFn, data, loading, ...props }, ref) => {
  const locale = useLocale();
  const { form } = useProductsBatchForm(data);
  const { combobox, currency, currencyQuery, altCurrencyFormat } =
    useProductUpdate();
  const tButton = useTranslations("Button");
  const t = useTranslations("Products");

  return (
    <Box {...props}>
      <form className="flex flex-col gap-4" noValidate id="product-batch-form">
        <Controller
          name={"outlet_id"}
          control={form.control}
          render={({ field: { onChange, value } }) => (
            <Select
              required
              label={t("Add.label_outlet")}
              size="lg"
              className="w-full"
              data={combobox.outlets}
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
              label={t("Add.label_stock")}
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
              label={t("Add.label_currency")}
              className="w-full"
              data={combobox.productCurrencies}
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
              label={t("Add.label_capital_price")}
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
              label={t("Add.label_selling_price")}
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
                label={t("Add.label_expired_at")}
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
          type="button"
          loading={loading ? loading : false}
          onClick={form.handleSubmit((formData) => {
            submitFn(formData);
          })}
        >
          {tButton("save")}
        </Button>
      </form>
    </Box>
  );
});

ProductBatchForm.displayName = "ProductBatchForm";
export default ProductBatchForm;
