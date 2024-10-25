"use client";

import { Link } from "@/i18n/routing";
import { Box, BoxProps, Button, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { forwardRef } from "react";

const ProductsHeader = forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const t = useTranslations("Products");

    return (
      <Box {...props}>
        <div className="flex flex-row justify-between">
          <div className="flex justify-between flex-col">
            <Text variant="gradient" className="text-4xl sm:text-5xl font-bold">
              {t("header")}
            </Text>
            <Text className="text-lg opacity-75 mt-2 w-full sm:w-[450px]">
              {t("subheader")}
            </Text>
          </div>
          <Button
            leftSection={<IconPlus />}
            variant="gradient"
            size="md"
            component={Link}
            href="/products/add"
          >
            {t("btn_add")}
          </Button>
        </div>
      </Box>
    );
  }
);

ProductsHeader.displayName = "ProductsHeader";
export default ProductsHeader;
