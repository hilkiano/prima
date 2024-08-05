"use client";

import { Box, BoxProps, Center } from "@mantine/core";
import React from "react";
import { useTranslations } from "next-intl";
import WelcomeScreen from "./WelcomeScreen";
import { useSearchParams } from "next/navigation";
import { OnboardingOptions } from "../hooks/onboarding.hooks";
import OnboardingFinish from "./OnboardingFinish";
import OnboardingStepper from "./OnboardingStepper";
import OnboardingPersonalInfo from "./OnboardingPersonalInfo";
import OnboardingCompanyInfo from "./OnboardingCompanyInfo";
import OnboardingTnc from "./OnboardingTnc";

type TOnboardingContainer = {};

const OnboardingContainer = React.forwardRef<
  HTMLDivElement,
  TOnboardingContainer & BoxProps
>(({ ...props }, ref) => {
  const t = useTranslations("Onboarding.Container");

  const searchParams = useSearchParams();
  const optionParam = searchParams.get("option") as OnboardingOptions | null;

  const renderByOptions = (option: OnboardingOptions | null) => {
    switch (option) {
      case "personal-info":
        return (
          <div className="flex flex-col w-full max-w-[900px] mt-14 gap-4">
            <h1>{t("header")}</h1>
            <div className="flex gap-2">
              <OnboardingStepper className="shrink-0 w-[300px]" />
              <OnboardingPersonalInfo className="w-full" />
            </div>
          </div>
        );
      case "company-info":
        return (
          <div className="flex flex-col w-full max-w-[900px] mt-14 gap-4">
            <h1>{t("header")}</h1>
            <div className="flex gap-2">
              <OnboardingStepper className="shrink-0 w-[300px]" />
              <OnboardingCompanyInfo className="w-full" />
            </div>
          </div>
        );
      case "terms-and-conditions":
        return (
          <div className="flex flex-col w-full max-w-[900px] mt-14 gap-4">
            <h1>{t("header")}</h1>
            <div className="flex gap-2">
              <OnboardingStepper className="shrink-0 w-[300px]" />
              <OnboardingTnc className="w-full" />
            </div>
          </div>
        );
      case "completed":
        return (
          <Center className="h-auto w-full md:h-[calc(100vh-32px)] mt-10 md:mt-0">
            <OnboardingFinish className="flex flex-col items-center text-center max-w-[600px]" />
          </Center>
        );
      case null:
        return (
          <Center className="h-auto w-full md:h-[calc(100vh-32px)] mt-10 md:mt-0">
            <WelcomeScreen className="flex flex-col items-center text-center max-w-[1000px]" />
          </Center>
        );

      default:
        return <></>;
    }
  };

  return <Box {...props}>{renderByOptions(optionParam)}</Box>;
});

OnboardingContainer.displayName = "OnboardingContainer";

export default OnboardingContainer;
