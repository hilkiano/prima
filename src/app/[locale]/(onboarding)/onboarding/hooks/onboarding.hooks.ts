"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { useSearchParams } from "next/navigation";
import { useLocalStorage } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { handleNewSubscription } from "@/services/subscription.service";
import { useGlobalMessageContext } from "@/lib/globalMessageProvider";
import { useUserContext } from "@/lib/userProvider";
import {
  Authenticated,
  CompanyInfo,
  JsonResponse,
  Onboarding,
  PersonalInfo,
} from "@/types/common.types";

export type OnboardingOptions =
  | "personal-info"
  | "company-info"
  | "terms-and-conditions"
  | "completed";

export default function useOnboarding() {
  const t = useTranslations("Onboarding");
  const router = useRouter();
  const { message } = useGlobalMessageContext();

  const [onboardingData, setOnboardingData, removeOnboardingData] =
    useLocalStorage<Onboarding>({
      key: "onboarding-data",
      defaultValue: {
        personal_info: {} as PersonalInfo,
        company_info: {} as CompanyInfo,
        tnc: false,
      },
    });
  const { userData, setUserData } = useUserContext();

  const mutation = useMutation({
    mutationFn: (data: Omit<Onboarding, "tnc"> & { user_id: string }) =>
      handleNewSubscription(message, data),
    onSuccess: () => {
      removeOnboardingData();
      updateUserData();
      handleStep(3);
    },
  });

  const updateUserData = async () => {
    await fetch(`/api/auth/me`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res: JsonResponse<Authenticated>) => {
        setUserData(res.data);
      })
      .catch((err: Error) => {
        throw new Error(err.message, err);
      });
  };

  const saveOnboardingData = (
    type: "personal_info" | "company_info" | "tnc",
    data: PersonalInfo | CompanyInfo | boolean
  ) => {
    switch (type) {
      case "personal_info":
        setOnboardingData({
          ...onboardingData,
          personal_info: data as PersonalInfo,
        });
        break;
      case "company_info":
        setOnboardingData({
          ...onboardingData,
          company_info: data as CompanyInfo,
        });
        break;
      case "tnc":
        setOnboardingData({ ...onboardingData, tnc: data as boolean });
        if (userData) {
          mutation.mutate({
            company_info: onboardingData.company_info,
            personal_info: onboardingData.personal_info,
            user_id: userData.user.id,
          });
        }

        break;

      default:
        break;
    }
  };

  const [step, setStep] = React.useState<number>(0);

  const handleStep = (step: number) => {
    switch (step) {
      case 0:
        handleNavigation("personal-info");
        break;
      case 1:
        handleNavigation("company-info");
        break;
      case 2:
        handleNavigation("terms-and-conditions");
        break;
      case 3:
        handleNavigation("completed");
        break;
      default:
        break;
    }
    setStep(step);
  };

  const handleNavigation = (option: OnboardingOptions) => {
    router.push(`/onboarding?option=${option}`);
  };

  return {
    handleNavigation,
    step,
    handleStep,
    onboardingData,
    saveOnboardingData,
    removeOnboardingData,
    mutation,
  };
}
