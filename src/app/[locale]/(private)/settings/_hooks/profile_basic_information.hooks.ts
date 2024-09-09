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
import { Authenticated, JsonResponse } from "@/types/common.types";
import { showSuccess } from "@/lib/errorHandler";

export default function useProfileBasicInformation() {
  const tForm = useTranslations("Form");
  const t = useTranslations("Settings.Profile");

  const { userData, setUserData } = useUserContext();

  const isUsernameExist = async (val: string) => {
    try {
      const validate = await handleValidate({
        model: "User",
        column: "username",
        value: val,
        case_sensitive: true,
        except: userData?.user.id,
      });

      return !validate.data;
    } catch (error) {
      return new Error("Failed to validate username");
    }
  };

  const schema = z
    .object({
      id: z.string(),
      username: z
        .string()
        .max(100, tForm("validation_max_char", { max: 100 }))
        .refine(isUsernameExist, tForm("validation_username_exist")),
      display_name: z.string().min(1, tForm("validation_required")),
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
      id: userData?.user.id,
      username: userData?.user.username ?? "",
      address: userData?.user.address ?? "",
      display_name: userData?.user.display_name ?? "",
      phone_number: userData?.user.phone_number ?? "",
      phone_code: userData?.user.phone_code ?? "",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: (data: {
      class: "User";
      payload: { payload: Partial<User> };
    }) => updateFn(data),
    onSuccess: (res) => {
      showSuccess(res.i18n.alert, null);
      updateUserData();
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

  return {
    mutation,
    form,
  };
}
