"use client";

import { Box, BoxProps, Divider } from "@mantine/core";
import React, { forwardRef } from "react";
import useProductUpdate from "../_hooks/product_update.hooks";
import { cleanData } from "@/lib/helpers";
import ProductForm from "./ProductForm";
import ProductVariantForm from "./ProductVariantForm";

const ProductUpdateFormContainer = forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const { form, dataQuery, mutations } = useProductUpdate();

    if (!dataQuery.data) {
      return (
        <Box className="mt-4 max-w-[1000px] w-full ml-auto mr-auto">
          <div className="animate-pulse mt-4 rounded-xl dark:bg-slate-800 bg-slate-200 h-[380px]"></div>
        </Box>
      );
    }

    return (
      <Box {...props}>
        <ProductForm />
        <Divider className="my-4 sm:my-6" />
        {dataQuery.data.data.variants?.map((variant, id) => (
          <ProductVariantForm
            key={id}
            data={variant}
            number={id + 1}
            singleVariant={dataQuery.data.data.variants?.length === 1}
          />
        ))}
      </Box>
    );
  }
);

ProductUpdateFormContainer.displayName = "ProductUpdateFormContainer";
export default ProductUpdateFormContainer;
