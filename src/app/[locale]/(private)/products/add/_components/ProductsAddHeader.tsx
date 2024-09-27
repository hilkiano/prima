"use client";

import { Box, BoxProps, Button, Text } from "@mantine/core";
import { IconFileTypeCsv } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React from "react";

const ProductsAddHeader = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const t = useTranslations("Products.Add");

    return (
      <Box {...props}>
        <div className="flex flex-col xs:flex-row justify-between items-center gap-4">
          <Text variant="gradient" className="text-4xl sm:text-5xl font-bold">
            {t("header")}
          </Text>
          <Button
            leftSection={<IconFileTypeCsv />}
            variant="gradient"
            size="md"
            className="xs:w-auto w-full"
          >
            {t("btn_import")}
          </Button>
        </div>
      </Box>
    );
  }
);

ProductsAddHeader.displayName = "ProductsAddHeader";
export default ProductsAddHeader;