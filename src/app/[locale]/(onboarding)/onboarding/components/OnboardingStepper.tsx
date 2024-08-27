import {
  Box,
  BoxProps,
  Stepper,
  StepperProps,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import useOnboarding, { OnboardingOptions } from "../hooks/onboarding.hooks";
import { useTranslations } from "next-intl";
import {
  IconBuilding,
  IconCheck,
  IconScript,
  IconUser,
} from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useMediaQuery } from "@mantine/hooks";

type TOnboardingStepper = {};

const OnboardingStepper = React.forwardRef<
  HTMLDivElement,
  TOnboardingStepper & BoxProps
>(({ ...props }, ref) => {
  const { handleStep } = useOnboarding();
  const t = useTranslations("Onboarding.Stepper");
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  const searchParams = useSearchParams();
  const optionParam = searchParams.get("option") as OnboardingOptions | null;

  const getActiveStep = (optionParam: OnboardingOptions | null): number => {
    switch (optionParam) {
      case null:
        return 0;

      case "personal-info":
        return 0;

      case "company-info":
        return 1;

      case "terms-and-conditions":
        return 2;

      default:
        return 0;
    }
  };

  return (
    <Box {...props}>
      <Stepper
        active={getActiveStep(optionParam)}
        onStepClick={(number) => handleStep(number)}
        orientation={isMobile ? "horizontal" : "vertical"}
        allowNextStepsSelect={false}
        completedIcon={<IconCheck stroke={3} />}
      >
        <Stepper.Step
          icon={<IconUser stroke={3} />}
          label={isMobile ? "" : t("personal_info")}
        />
        <Stepper.Step
          icon={<IconBuilding stroke={3} />}
          label={isMobile ? "" : t("company_info")}
        />
        <Stepper.Step
          icon={<IconScript stroke={3} />}
          label={isMobile ? "" : t("tnc")}
        />
      </Stepper>
    </Box>
  );
});

OnboardingStepper.displayName = "OnboardingStepper";

export default OnboardingStepper;
