"use client";

import { Box, BoxProps, UnstyledButton } from "@mantine/core";
import { useTranslations } from "next-intl";
import React from "react";
import { Link } from "@/lib/navigation";
import { useSearchParams } from "next/navigation";

type TCategoryItem = {
  icon: React.ReactNode;
  name: string;
  url: string;
};

const categories: TCategoryItem[] = [
  {
    icon: "🪪",
    name: "profile",
    url: "profile",
  },
  {
    icon: "🏬",
    name: "company",
    url: "company",
  },
  {
    icon: "🏪",
    name: "outlet",
    url: "outlet",
  },
];

const SettingsSidebar = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const t = useTranslations("Settings");
    const searchParams = useSearchParams();
    const submenuParam = searchParams.get("submenu");

    return (
      <Box {...props}>
        <p className="text-base uppercase tracking-widest font-bold mb-4">
          {t("Sidebar.title")}
        </p>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <UnstyledButton
              component={Link}
              href={`/settings?submenu=${cat.url}`}
              className="dark:hover:bg-slate-800 hover:bg-slate-200/50 flex items-center gap-4 rounded-md px-2 py-3 data-[active=true]:font-bold data-[active=true]:text-blue-400 data-[active=true]:dark:bg-blue-400/10 data-[active=true]:bg-blue-400/10 transition-colors"
              key={cat.name}
              data-active={cat.name === submenuParam || undefined}
            >
              <p className="text-[28px] !leading-[28px] m-0 pb-2">{cat.icon}</p>
              {t(`Sidebar.${cat.name}`)}
            </UnstyledButton>
          ))}
        </div>
      </Box>
    );
  }
);

SettingsSidebar.displayName = "SettingsSidebar";
export default SettingsSidebar;
