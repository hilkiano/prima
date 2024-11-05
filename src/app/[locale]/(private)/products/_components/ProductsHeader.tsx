"use client";

import { Link } from "@/i18n/routing";
import { Box, BoxProps, Button, Card, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { forwardRef } from "react";
import useProductsHeader from "../_hooks/products_header.hooks";
import { Carousel } from "@mantine/carousel";
import StatisticCard from "@/components/statistics/StatisticCard";
import { useUserContext } from "@/lib/userProvider";

const ProductsHeader = forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const t = useTranslations("Products");
    const { statisticQuery } = useProductsHeader();
    const { userData } = useUserContext();

    const Statistics = () => {
      if (statisticQuery.isLoading) {
        const data = Array(3)
          .fill(null)
          .map((u, i) => i);

        return data.map((d, i) => (
          <Carousel.Slide key={i}>
            <Card className="p-4 rounded-lg bg-slate-300/70 dark:bg-slate-800 h-[120px] animate-pulse"></Card>
          </Carousel.Slide>
        ));
      } else {
        if (statisticQuery.data) {
          const slides = [];
          for (const key in statisticQuery.data.data) {
            const value = statisticQuery.data.data[key] as unknown;
            slides.push(
              <Carousel.Slide key={key}>
                <StatisticCard
                  className="p-4 rounded-lg bg-slate-300/70 dark:bg-slate-800 h-[120px] relative select-none"
                  title={key}
                  type="number"
                  data={value as number}
                />
              </Carousel.Slide>
            );
          }

          return slides;
        }
      }
    };

    return (
      <Box {...props}>
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex justify-between flex-col gap-4">
            <Text variant="gradient" className="text-4xl sm:text-5xl font-bold">
              {t("header")}
            </Text>
            <Text className="text-lg opacity-75 mt-2 w-full sm:w-[450px]">
              {t("subheader")}
            </Text>
            {userData?.privileges.includes("PAGE_PRODUCTS_ADD_PRODUCT") ? (
              <Button
                leftSection={<IconPlus />}
                variant="gradient"
                size="md"
                component={Link}
                href="/products/add"
                className="self-start"
              >
                {t("btn_add")}
              </Button>
            ) : (
              <></>
            )}
          </div>
          <Carousel
            slideSize={250}
            slideGap="lg"
            slidesToScroll={1}
            containScroll="trimSnaps"
            dragFree
            withControls={false}
            classNames={{
              root: "w-full",
            }}
          >
            <Statistics />
          </Carousel>
        </div>
      </Box>
    );
  }
);

ProductsHeader.displayName = "ProductsHeader";
export default ProductsHeader;
