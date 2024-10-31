"use client";

import { nFormatter } from "@/lib/helpers";
import { Card, CardProps } from "@mantine/core";
import { useLocale, useTranslations } from "next-intl";
import React, { forwardRef } from "react";

type TStatisticCardBase = {
  title: string;
  type: "number" | "currency" | "graph";
};

type TStatisticCard = TStatisticCardBase &
  (
    | { type: "number"; data: number }
    | { type: "currency"; data: string }
    | { type: "graph"; data: React.ReactNode }
  );

const StatisticCard = forwardRef<HTMLDivElement, TStatisticCard & CardProps>(
  ({ title, type, data, ...props }, ref) => {
    const t = useTranslations("Products");
    const locale = useLocale();

    return (
      <Card {...props}>
        <h1 className="m-0 opacity-70 text-lg">{t(title)}</h1>
        {type === "number" ? (
          <h1 className="m-0 absolute bottom-4 right-4 text-xl opacity-80">
            {Intl.NumberFormat(locale).format(data)}
          </h1>
        ) : type === "currency" ? (
          <></>
        ) : type === "graph" ? (
          <></>
        ) : (
          <></>
        )}
      </Card>
    );
  }
);

StatisticCard.displayName = "StatisticCard";
export default StatisticCard;
