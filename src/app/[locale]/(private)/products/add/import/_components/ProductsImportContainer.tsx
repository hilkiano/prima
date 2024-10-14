import { Box, BoxProps } from "@mantine/core";
import React from "react";
import GetTemplate from "./GetTemplate";

const ProductsImportContainer = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    return (
      <Box {...props}>
        <div className="flex flex-col gap-2">
          <GetTemplate />
        </div>
      </Box>
    );
  }
);

ProductsImportContainer.displayName = "ProductsImportContainer";
export default ProductsImportContainer;
