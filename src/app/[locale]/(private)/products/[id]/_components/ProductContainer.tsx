"use client";

import { Link, useRouter } from "@/i18n/routing";
import { Box, BoxProps, Button } from "@mantine/core";
import { IconChevronLeft, IconEdit } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { forwardRef } from "react";
import ProductHead from "./ProductHead";
import { useQuery } from "@tanstack/react-query";
import { getFn } from "@/services/crud.service";
import ProductMetadata from "./ProductMetadata";
import ProductVariants from "./ProductVariants";
import { useParams } from "next/navigation";
import { useUserContext } from "@/lib/userProvider";

const ProductContainer = forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const t = useTranslations("Button");
    const router = useRouter();
    const params = useParams();
    const { userData } = useUserContext();

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

    return dataQuery.data ? (
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
          {userData?.privileges.includes("DATA_UPDATE_PRODUCT") ? (
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
          ) : (
            <></>
          )}
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
    ) : (
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
        </div>
        <div className="animate-pulse mt-4 rounded-lg dark:bg-slate-800 bg-slate-200 h-[280px]"></div>
        <div className="animate-pulse mt-4 rounded-lg dark:bg-slate-800 bg-slate-200 h-[180px]"></div>
        <div className="animate-pulse mt-4 rounded-lg dark:bg-slate-800 bg-slate-200 h-[480px]"></div>
      </Box>
    );
  }
);

ProductContainer.displayName = "ProductContainer";
export default ProductContainer;
