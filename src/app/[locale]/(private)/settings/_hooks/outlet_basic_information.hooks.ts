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

export default function useOutletBasicInformation() {
  const tForm = useTranslations("Form");
  const t = useTranslations("Settings.Outlet");

  const { userData, setUserData } = useUserContext();

  const schema = z
    .object({
      id: z.string(),
      name: z.string().max(100, tForm("validation_max_char", { max: 100 })),
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
      id: userData?.outlet.id,
      name: userData?.outlet.name ?? "",
      address: userData?.outlet.address ?? "",
      email: userData?.outlet.email ?? "",
      phone_number: userData?.outlet.phone_number ?? "",
      phone_code: userData?.outlet.phone_code ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: {
      class: "Outlet";
      payload: { payload: Partial<Outlet> };
    }) => updateFn(data),
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
