"use client";

import { Box, BoxProps, Text } from "@mantine/core";
import React from "react";
import { useTranslations } from "next-intl";
import SettingsProfile from "./SettingsProfile";
import { useSearchParams } from "next/navigation";

const SettingsContainer = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const searchParams = useSearchParams();
    const submenuParam = searchParams.get("submenu");
    const t = useTranslations("Settings");

    return (
      <Box {...props}>
        {submenuParam ? (
          <>
            <Text
              variant="gradient"
              className="text-3xl sm:text-4xl font-black py-2"
            >
              {t(`Sidebar.${submenuParam}`)}
            </Text>
            {submenuParam === "profile" ? (
              <SettingsProfile className="mt-4" />
            ) : (
              <></>
            )}
          </>
        ) : (
          <Box>Please select category on the left.</Box>
        )}
      </Box>
    );
  }
);

SettingsContainer.displayName = "SettingsContainer";
export default SettingsContainer;
