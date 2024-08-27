"use client";

import { useTranslations } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import isMobilePhone from "validator/es/lib/isMobilePhone";
import { handleValidate } from "@/services/validate.service";
import { useGlobalMessageContext } from "@/lib/globalMessageProvider";
import { showError } from "@/lib/errorHandler";

export default function useOnboardingCompanyInfo() {
  const tForm = useTranslations("Form");
  const t = useTranslations("Onboarding.CompanyInfo");
  const { message } = useGlobalMessageContext();

  const isCompanyExist = async (val: string) => {
    try {
      const validate = await handleValidate(message, {
        model: "Company",
        column: "name",
        value: val,
      });

      return !validate.data;
    } catch (error) {
      return new Error("Failed to validate username");
    }
  };

  const schema = z.object({
    name: z
      .string()
      .min(1, tForm("validation_required"))
      .refine(isCompanyExist, tForm("validation_company_exist")),
    address: z.string().min(1, tForm("validation_required")),
    email: z
      .string()
      .min(1, tForm("validation_required"))
      .email(tForm("validation_email")),
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
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      address: "",
      email: "",
      phone_number: "",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  return {
    schema,
    form,
  };
}
