import { Badge, Box, BoxProps, Switch, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import React, { forwardRef } from "react";
import useProductsData from "../../_hooks/products_data.hooks";
import { modals } from "@mantine/modals";
import { useUserContext } from "@/lib/userProvider";

type TProductHead = {
  data: Product;
};

const ProductHead = forwardRef<HTMLDivElement, BoxProps & TProductHead>(
  ({ data, ...props }, ref) => {
    const tButton = useTranslations("Button");
    const t = useTranslations("Products");
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
    const { userData } = useUserContext();

    const { mutations } = useProductsData();

    const handleCheck = (val: React.ChangeEvent<HTMLInputElement>) => {
      if (!val.target.checked) {
        modals.openConfirmModal({
          centered: true,
          size: "lg",
          title: t("modal_disable_title"),
          labels: {
            confirm: tButton("yes"),
            cancel: tButton("no"),
          },
          children: <p className="m-0">{t("modal_disable_body")}</p>,
          onCancel: () => {},
          onConfirm: () => {
            mutations.mutationDisable.mutate({
              class: "Product",
              payload: {
                payload: {
                  id: data.id,
                },
              },
            });
          },
        });
      } else {
        modals.openConfirmModal({
          centered: true,
          size: "lg",
          title: t("modal_enable_title"),
          labels: {
            confirm: tButton("yes"),
            cancel: tButton("no"),
          },
          children: <p className="m-0">{t("modal_enable_body")}</p>,
          onCancel: () => {},
          onConfirm: () => {
            mutations.mutationEnable.mutate({
              class: "Product",
              payload: {
                payload: {
                  id: data.id,
                },
              },
            });
          },
        });
      }
    };

    return (
      <Box {...props}>
        <p className="absolute top-4 left-4 xs:left-6 opacity-30 m-0 italic">
          {data.id}
        </p>
        <h1 className="text-2xl xs:text-3xl m-0 mt-8 xs:mt-6">{data.name}</h1>
        <div className="flex justify-between flex-col md:flex-row mt-4 gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg opacity-70 font-light m-0 w-full md:w-[400px]">
              {data.details}
            </h3>
            {data.category ? (
              <Badge variant="dot">{data.category?.name}</Badge>
            ) : (
              <></>
            )}
          </div>

          {userData?.privileges.includes("DATA_DELETE_PRODUCT") ? (
            <Switch
              size={isMobile ? "sm" : "lg"}
              onChange={(val) => handleCheck(val)}
              checked={!data.deleted_at}
              classNames={{
                root: "w-fit self-end",
              }}
              label={t("active")}
            />
          ) : (
            <></>
          )}
        </div>
      </Box>
    );
  }
);

ProductHead.displayName = "ProductHead";
export default ProductHead;
