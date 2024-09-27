import { Box, BoxProps, Pill } from "@mantine/core";
import { useTranslations } from "next-intl";
import React from "react";

type TProductsFormField = {
  label: string;
  description?:
    | string
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactNodeArray;
  field: React.ReactNode;
  required?: boolean;
};

const ProductsFormField = React.forwardRef<
  HTMLDivElement,
  BoxProps & TProductsFormField
>(({ label, description, field, required = false, ...props }, ref) => {
  const t = useTranslations("Form");
  return (
    <Box {...props}>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-8">
        <div className="flex flex-col gap-2 w-full sm:w-[300px] shrink-0">
          <div className="flex flex-row gap-2 items-center">
            <h1 className="m-0">{label}</h1>
            {required ? (
              <Pill className="bg-slate-300 dark:bg-slate-700 uppercase font-semibold">
                {t("required")}
              </Pill>
            ) : (
              <></>
            )}
          </div>

          {description ? (
            <p className="opacity-75 text-sm m-0">{description}</p>
          ) : (
            <></>
          )}
        </div>
        {field}
      </div>
    </Box>
  );
});

ProductsFormField.displayName = "ProductsFormField";
export default ProductsFormField;
