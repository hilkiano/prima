"use client";

import { useTranslations } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import isMobilePhone from "validator/es/lib/isMobilePhone";
import { handleValidate } from "@/services/validate.service";

export default function useOnboardingCompanyInfo() {
  const tForm = useTranslations("Form");
  const t = useTranslations("Onboarding.CompanyInfo");

  const isCompanyExist = async (val: string) => {
    try {
      const validate = await handleValidate({
        model: "Company",
        column: "name",
        value: val,
      });

      return !validate.data;
    } catch (error) {
      return new Error("Failed to validate username");
    }
  };

  const schema = z
    .object({
      name: z
        .string()
        .min(1, tForm("validation_required"))
        .refine(isCompanyExist, tForm("validation_company_exist")),
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
      name: "",
      address: "",
      email: "",
      phone_number: "",
      phone_code: "",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  return {
    schema,
    form,
  };
}
