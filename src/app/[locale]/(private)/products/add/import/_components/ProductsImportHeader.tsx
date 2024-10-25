"use client";

import { Link } from "@/i18n/routing";
import {
  ActionIcon,
  Box,
  BoxProps,
  Button,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronLeft } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React from "react";

const ProductsImportHeader = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const tButton = useTranslations("Button");
    const t = useTranslations("Products.Import");
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

    return (
      <Box {...props}>
        {isMobile ? (
          <ActionIcon
            component={Link}
            href="/products/add"
            aria-label="go back"
            variant="outline"
            radius="xl"
            className="border-2"
          >
            <IconChevronLeft />
          </ActionIcon>
        ) : (
          <Button
            variant="outline"
            component={Link}
            href="/products/add"
            leftSection={<IconChevronLeft />}
          >
            {tButton("back")}
          </Button>
        )}

        <Text variant="gradient" className="text-4xl sm:text-5xl font-bold">
          {t("header")}
        </Text>
      </Box>
    );
  }
);

ProductsImportHeader.displayName = "ProductsImportHeader";
export default ProductsImportHeader;
