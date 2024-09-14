"use client";

import { useTranslations } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "@/lib/userProvider";
import { useMutation } from "@tanstack/react-query";
import { updateFn } from "@/services/crud.service";
import { showSuccess } from "@/lib/errorHandler";
import { updateUserData } from "@/lib/helpers";

export default function useProfileSecurity() {
  const tForm = useTranslations("Form");
  const t = useTranslations("Settings.Profile");
  const { userData, setUserData } = useUserContext();

  const schema = z
    .object({
      id: z.string(),
      password: z
        .string()
        .min(8, tForm("validation_min_char", { min: 8 }))
        .regex(/[A-Z]/, tForm("validation_password_capital"))
        .regex(/\d/, tForm("validation_password_number")),
      confirm_password: z.string(),
    })
    .superRefine(({ confirm_password, password }, ctx) => {
      if (confirm_password !== password) {
        ctx.addIssue({
          code: "custom",
          message: tForm("validation_password_match"),
          path: ["confirm_password"],
        });
      }
    });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: userData?.user.id,
      password: "",
      confirm_password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: {
      class: "User";
      payload: { payload: Partial<User> };
    }) => updateFn(data),
    onSuccess: (res) => {
      if (res.status) {
        showSuccess(res.i18n.alert, null);
        updateUserData(setUserData);
        form.reset();
      }
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  return {
    mutation,
    form,
  };
}
