"use client";

import { useUserContext } from "@/lib/userProvider";
import { Box, BoxProps, Button, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import React from "react";
import useOnboarding from "../hooks/onboarding.hooks";

type TWelcomeScreen = {};

const WelcomeScreen = React.forwardRef<
  HTMLDivElement,
  TWelcomeScreen & BoxProps
>(({ ...props }, ref) => {
  const tButton = useTranslations("Button");
  const t = useTranslations("Onboarding");
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  const { userData } = useUserContext();
  const { handleNavigation } = useOnboarding();

  return (
    <Box id="welcome-screen" {...props}>
      <h1 className="text-3xl md:text-5xl mb-1">
        {t("WelcomeScreen.head", { name: userData?.user.display_name })}
      </h1>
      <h3 className="text-xl md:text-3xl mt-1 font-light">
        {t("WelcomeScreen.body")}
      </h3>
      <Button
        size={isMobile ? "sm" : "lg"}
        variant="filled"
        leftSection={<i className="ti ti-arrow-right"></i>}
        onClick={() => handleNavigation("personal-info")}
      >
        {tButton("get_started")}
      </Button>
    </Box>
  );
});

WelcomeScreen.displayName = "WelcomeScreen";

export default WelcomeScreen;
