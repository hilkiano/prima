import { Box, BoxProps } from "@mantine/core";
import { useLocale, useTranslations } from "next-intl";
import { forwardRef } from "react";
import dayjs from "dayjs";

import "dayjs/locale/id";

type TProductMetadata = {
  data: Product;
};

const ProductMetadata = forwardRef<HTMLDivElement, BoxProps & TProductMetadata>(
  ({ data, ...props }, ref) => {
    const t = useTranslations("Products");
    const locale = useLocale();

    return (
      <Box {...props}>
        <p className="m-0 font-bold text-sm uppercase">{t("created")}</p>
        <p className="m-0 opacity-60">
          {t.rich("date_metadata", {
            date: dayjs(data.created_at)
              .locale(locale)
              .format("dddd, YYYY-MM-DD HH:mm:ss"),
            user: data.created_user?.display_name,
          })}
        </p>
        <p className="m-0 font-bold text-sm uppercase mt-2">{t("updated")}</p>
        <p className="m-0 opacity-60">
          {t.rich("date_metadata", {
            date: dayjs(data.updated_at)
              .locale(locale)
              .format("dddd, YYYY-MM-DD HH:mm:ss"),
            user: data.updated_user?.display_name,
          })}
        </p>
      </Box>
    );
  }
);

ProductMetadata.displayName = "ProductMetadata";
export default ProductMetadata;
