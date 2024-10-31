"use client";

import { Link, useRouter } from "@/i18n/routing";
import { Box, BoxProps, Button } from "@mantine/core";
import { IconChevronLeft, IconEdit } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { forwardRef } from "react";
import ProductHead from "./ProductHead";
import { useQuery } from "@tanstack/react-query";
import { getFn } from "@/services/crud.service";
import { JsonResponse } from "@/types/common.types";
import ProductMetadata from "./ProductMetadata";
import ProductVariants from "./ProductVariants";

type TProductContainer = {
  data: JsonResponse<Product>;
};

const ProductContainer = forwardRef<
  HTMLDivElement,
  BoxProps & TProductContainer
>(({ data, ...props }, ref) => {
  const t = useTranslations("Button");
  const router = useRouter();

  const dataQuery = useQuery({
    queryKey: ["productData"],
    queryFn: () =>
      getFn<Product>({
        class: "Product",
        id: data.data.id,
        relations:
          "category&variants.batches.outlet&variants.batches.currency&createdUser&updatedUser",
      }),
    initialData: data,
    refetchOnReconnect: false,
  });

  return (
    <Box {...props}>
      <div className="flex flex-col xs:flex-row justify-between items-center gap-4">
        <Button
          leftSection={<IconChevronLeft />}
          variant="outline"
          className="w-full xs:w-auto"
          onClick={router.back}
        >
          {t("go_back")}
        </Button>
        <Button
          leftSection={<IconEdit />}
          variant="gradient"
          onClick={() => {
            if (!dataQuery.data.data.deleted_at) {
              router.push(`/products/update/${dataQuery.data.data.id}`);
            }
          }}
          className="w-full xs:w-auto"
          disabled={!!dataQuery.data.data.deleted_at}
        >
          {t("update")}
        </Button>
      </div>

      <ProductHead
        className="rounded-lg p-4 mt-4 xs:p-6 dark:bg-slate-800 bg-slate-200 relative"
        data={dataQuery.data?.data}
      />
      <ProductMetadata
        className="rounded-lg p-4 mt-4 xs:p-6 dark:bg-slate-800 bg-slate-200 relative"
        data={dataQuery.data.data}
      />
      <ProductVariants
        className="rounded-lg p-4 mt-4 xs:p-6 dark:bg-slate-800 bg-slate-200 relative"
        data={dataQuery.data.data}
      />
    </Box>
  );
});

ProductContainer.displayName = "ProductContainer";
export default ProductContainer;
