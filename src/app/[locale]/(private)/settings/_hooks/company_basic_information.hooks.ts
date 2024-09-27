"use client";

import { useTranslations } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import isMobilePhone from "validator/es/lib/isMobilePhone";
import { handleValidate } from "@/services/validate.service";
import { useUserContext } from "@/lib/userProvider";
import { useMutation } from "@tanstack/react-query";
import { updateFn } from "@/services/crud.service";
import { showSuccess } from "@/lib/errorHandler";
import { updateUserData } from "@/lib/helpers";

type TCrudCompany = {
  class: string;
  payload: Partial<Company>;
};

export default function useCompanyBasicInformation() {
  const tForm = useTranslations("Form");
  const t = useTranslations("Settings.Company");

  const { userData, setUserData } = useUserContext();

  const isCompanyExist = async (val: string) => {
    try {
      const validate = await handleValidate({
        model: "Company",
        column: "name",
        value: val,
        except: userData?.company.id,
      });

      return !validate.data;
    } catch (error) {
      return new Error("Failed to validate company");
    }
  };

  const schema = z
    .object({
      id: z.string(),
      name: z
        .string()
        .max(100, tForm("validation_max_char", { max: 100 }))
        .refine(isCompanyExist, tForm("validation_company_exist")),
      email: z
        .string()
        .min(1, tForm("validation_required"))
        .email(tForm("validation_email")),
      address: z.string(),
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
      id: userData?.company.id,
      name: userData?.company.name ?? "",
      address: userData?.company.address ?? "",
      email: userData?.company.email ?? "",
      phone_number: userData?.company.phone_number ?? "",
      phone_code: userData?.company.phone_code ?? "",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: (data: {
      class: "Company";
      payload: { payload: Partial<Company> };
    }) => updateFn<TCrudCompany, Company>(data),
    onSuccess: (res) => {
      showSuccess(res.i18n.alert, null);
      updateUserData(setUserData);
    },
  });

  return {
    mutation,
    form,
  };
}
