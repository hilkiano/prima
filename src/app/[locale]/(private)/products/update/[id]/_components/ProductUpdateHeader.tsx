"use client";

import { useRouter } from "@/i18n/routing";
import { getFn } from "@/services/crud.service";
import { Box, BoxProps, Button, Text } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React from "react";

const ProductUpdateHeader = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const tButton = useTranslations("Button");
    const t = useTranslations("Products.Update");
    const params = useParams();
    const router = useRouter();

    const dataQuery = useQuery({
      queryKey: ["productData", params.id],
      queryFn: () =>
        getFn<Product>({
          class: "Product",
          id: params.id as string,
          relations:
            "category&variants.batches.outlet&variants.batches.currency&createdUser&updatedUser",
        }),
      refetchOnReconnect: false,
    });

    return (
      <Box {...props}>
        <Button
          leftSection={<IconChevronLeft />}
          variant="outline"
          className="w-full xs:w-auto self-start"
          onClick={router.back}
        >
          {tButton("go_back")}
        </Button>
        {dataQuery.data ? (
          <div className="flex flex-col xs:flex-row justify-between items-center gap-4">
            <Text variant="gradient" className="text-2xl sm:text-3xl font-bold">
              {t("header", {
                product_name: dataQuery.data?.data.name,
              })}
            </Text>
          </div>
        ) : (
          <div className="animate-pulse rounded-lg dark:bg-slate-800 bg-slate-200 h-[50px]"></div>
        )}
      </Box>
    );
  }
);

ProductUpdateHeader.displayName = "ProductUpdateHeader";
export default ProductUpdateHeader;
