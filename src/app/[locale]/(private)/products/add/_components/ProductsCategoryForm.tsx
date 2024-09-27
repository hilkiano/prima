import { Box, BoxProps, Button, Select, TextInput } from "@mantine/core";
import React from "react";
import useProductsCategoryForm from "../_hooks/products_category_form.hooks";
import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useUserContext } from "@/lib/userProvider";

type TProductsCategoryForm = {
  onFinish: () => void;
};

const ProductsCategoryForm = React.forwardRef<
  HTMLDivElement,
  BoxProps & TProductsCategoryForm
>(({ onFinish, ...props }, ref) => {
  const { form, productTypes, mutation } = useProductsCategoryForm(onFinish);
  const { userData } = useUserContext();
  const tButton = useTranslations("Button");
  const t = useTranslations("Products.Add");

  return (
    <Box {...props}>
      <form
        noValidate
        id="product-category-form"
        onSubmit={form.handleSubmit((data) => {
          mutation.mutate({
            class: "ProductCategory",
            payload: {
              payload: {
                name: data.name,
                type: data.type ? data.type : undefined,
                company_id: userData?.company.id,
                outlet_id: userData?.outlet.id,
              },
            },
          });
        })}
        className="flex flex-col gap-4"
      >
        <Controller
          name="type"
          control={form.control}
          render={({ field: { onChange, value } }) => (
            <Select
              className="w-full"
              description={t("description_category_type")}
              label={t("label_category_type")}
              error={form.formState.errors.type?.message}
              data={productTypes}
              value={value}
              onChange={onChange}
            />
          )}
        />
        <Controller
          name="name"
          control={form.control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={t("label_category_name")}
              description={t("description_category_name")}
              className="w-full"
              error={form.formState.errors.name?.message}
              autoComplete="off"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              maxLength={50}
              required
              rightSection={
                <div className="text-sm">
                  {form.getValues("name").length}/50
                </div>
              }
              rightSectionWidth={48}
            />
          )}
        />
        <Button
          className="mt-6 self-end"
          variant="filled"
          leftSection={<IconDeviceFloppy />}
          type="submit"
          loading={mutation.isPending}
        >
          {tButton("save")}
        </Button>
      </form>
    </Box>
  );
});

ProductsCategoryForm.displayName = "ProductsCategoryForm";
export default ProductsCategoryForm;
