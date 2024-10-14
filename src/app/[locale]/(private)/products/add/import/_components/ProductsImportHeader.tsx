"use client";

import { Link } from "@/lib/navigation";
import { Box, BoxProps, Button, Text } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React from "react";

const ProductsImportHeader = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const tButton = useTranslations("Button");
    const t = useTranslations("Products.Import");

    return (
      <Box {...props}>
        <Button
          variant="outline"
          component={Link}
          href="/products/add"
          leftSection={<IconChevronLeft />}
          className="self-start"
        >
          {tButton("back")}
        </Button>
        <Text variant="gradient" className="text-4xl sm:text-5xl font-bold">
          {t("header")}
        </Text>
      </Box>
    );
  }
);

ProductsImportHeader.displayName = "ProductsImportHeader";
export default ProductsImportHeader;
