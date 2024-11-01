import { cleanData } from "@/lib/helpers";
import {
  ActionIcon,
  Button,
  Modal,
  Select,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React, { FormHTMLAttributes, forwardRef } from "react";
import { Controller } from "react-hook-form";
import ProductsFormField from "../../../add/_components/ProductsFormField";
import useProductUpdate from "../_hooks/product_update.hooks";
import ProductsCategoryForm from "../../../add/_components/ProductsCategoryForm";
import { useDisclosure } from "@mantine/hooks";
import { useUserContext } from "@/lib/userProvider";

const ProductForm = forwardRef<
  HTMLFormElement,
  FormHTMLAttributes<HTMLFormElement>
>(({ ...props }, ref) => {
  const tButton = useTranslations("Button");
  const t = useTranslations("Products");
  const { userData } = useUserContext();
  const [opened, { open, close }] = useDisclosure(false);
  const { form, mutations, combobox, functions } = useProductUpdate();
  return (
    <>
      <form
        noValidate
        id="product-form"
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit((data) => {
          mutations.updateProduct.mutate({
            class: "Product",
            payload: {
              payload: cleanData({
                id: data.id,
                name: data.name,
                details: data.details ? data.details : undefined,
                type: data.type,
                product_category_id: data.product_category_id,
              }),
            },
          });
        })}
      >
        <Controller
          name="type"
          control={form.control}
          render={({ field: { onChange, value } }) => (
            <ProductsFormField
              required
              label={t("Add.label_type")}
              field={
                <Select
                  size="lg"
                  className="w-full sm:w-[250px]"
                  error={form.formState.errors.type?.message}
                  data={combobox.productTypes}
                  value={value}
                  onChange={(val) => {
                    onChange(val);
                    if (val) {
                      functions.filterCategory(val);
                    }
                  }}
                  required
                  allowDeselect={false}
                />
              }
            />
          )}
        />
        <Controller
          name="name"
          control={form.control}
          render={({ field: { onChange, onBlur, value } }) => (
            <ProductsFormField
              required
              label={t("Add.label_name")}
              description={t.rich("Add.description_name", {
                bold: (chunks) => <span className="font-bold">{chunks}</span>,
              })}
              field={
                <TextInput
                  size="lg"
                  className="w-full"
                  error={form.formState.errors.name?.message}
                  autoComplete="off"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  maxLength={255}
                  required
                  rightSection={<div>{form.getValues("name").length}/255</div>}
                  rightSectionWidth={68}
                />
              }
            />
          )}
        />
        <Controller
          name="details"
          control={form.control}
          render={({ field: { onChange, value } }) => (
            <ProductsFormField
              label={t("Add.label_details")}
              description={t("Add.description_details")}
              field={
                <Textarea
                  error={form.formState.errors.details?.message}
                  autoComplete="off"
                  value={value}
                  onChange={onChange}
                  autosize
                  minRows={4}
                  className="w-full"
                />
              }
            />
          )}
        />
        <Controller
          name="product_category_id"
          control={form.control}
          render={({ field: { onChange, value } }) => (
            <ProductsFormField
              label={t("Add.label_category")}
              field={
                <Select
                  className="w-full sm:w-[250px]"
                  error={form.formState.errors.product_category_id?.message}
                  leftSection={
                    userData?.privileges.includes(
                      "DATA_CREATE_PRODUCT_CATEGORY"
                    ) ? (
                      <Tooltip
                        openDelay={500}
                        label={t("Add.tooltip_category")}
                      >
                        <ActionIcon
                          size="sm"
                          variant="transparent"
                          type="button"
                          aria-label="add category button"
                          onClick={open}
                        >
                          <IconPlus stroke={3} />
                        </ActionIcon>
                      </Tooltip>
                    ) : undefined
                  }
                  searchable
                  nothingFoundMessage={t("Add.nothing_category")}
                  data={combobox.productCategories}
                  value={value}
                  onChange={onChange}
                  withScrollArea={false}
                  styles={{ dropdown: { maxHeight: 200, overflowY: "auto" } }}
                />
              }
            />
          )}
        />
        <div className="flex justify-end flex-col xs:flex-row gap-4 mt-6 mb-4">
          <Button
            variant="light"
            leftSection={<IconPlus />}
            type="button"
            size="lg"
            onClick={() => {}}
          >
            {t("Add.btn_add_variant")}
          </Button>
          <Button
            variant="gradient"
            leftSection={<IconDeviceFloppy />}
            type="submit"
            size="lg"
          >
            {tButton("save")}
          </Button>
        </div>
      </form>

      <Modal opened={opened} onClose={close} title={t("Add.tooltip_category")}>
        <ProductsCategoryForm onFinish={close} />
      </Modal>
    </>
  );
});

ProductForm.displayName = "ProductForm";
export default ProductForm;