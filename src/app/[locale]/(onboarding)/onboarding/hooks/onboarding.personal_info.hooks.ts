"use client";

import { useTranslations } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "@/lib/userProvider";
import isMobilePhone from "validator/es/lib/isMobilePhone";

export default function useOnboardingPersonalInfo() {
  const tForm = useTranslations("Form");
  const t = useTranslations("Onboarding.PersonalInfo");
  const { userData } = useUserContext();

  const genderOptions = [
    {
      label: t("option_gender_male"),
      value: "male",
    },
    {
      label: t("option_gender_female"),
      value: "female",
    },
    {
      label: t("option_gender_not_answered"),
      value: "not_answered",
    },
  ] as const;

  type TGenderOption = (typeof genderOptions)[number]["value"];
  const values: [TGenderOption, ...TGenderOption[]] = [
    genderOptions[0].value,
    ...genderOptions.slice(1).map((p) => p.value),
  ];

  const schema = z
    .object({
      family_name: z.string().min(1, tForm("validation_required")),
      given_name: z.string(),
      gender: z.enum(values, {
        required_error: tForm("validation_required"),
      }),
      address: z.string().min(1, tForm("validation_required")),
      email: z
        .string()
        .min(1, tForm("validation_required"))
        .email(tForm("validation_email")),
      phone_code: z.string(),
      phone_number: z
        .string()
        .min(1, tForm("validation_required"))
        .refine(
          (val) => {
            return val === "" || isMobilePhone(val);
          },
          {
            message: tForm("validation_phone_number"),
          }
        ),
    })
    .refine(
      (data) => {
        if (data.phone_number !== "") {
          return data.phone_code !== "";
        }
      },
      {
        message: tForm("validation_required"),
        path: ["phone_code"],
      }
    );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      family_name: userData?.user.socialite_user.user.family_name
        ? userData?.user.socialite_user.user.family_name
        : "",
      given_name: userData?.user.socialite_user.user.given_name,
      gender: undefined,
      address: "",
      email: userData?.user.email,
      phone_code: userData?.geolocation.calling_code ?? "",
      phone_number: "",
    },
  });

  return {
    schema,
    form,
    genderOptions,
  };
}
