"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { handleLogin } from "@/services/auth.service";
import { useRouter } from "@/i18n/routing";
import { useUserContext } from "@/lib/userProvider";
import { Authenticated, JsonResponse } from "@/types/common.types";

export default function useLoginPage() {
  const t = useTranslations("Public.Login");
  const router = useRouter();
  const { setUserData } = useUserContext();

  const schema = z.object({
    username: z.string().min(1, t("email_min_validation")),
    password: z.string().min(1, t("password_min_validation")),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof schema>) => handleLogin(data),
    onSuccess: (res: JsonResponse<Authenticated>) => {
      if (res.code === 200) {
        setUserData({
          user: res.data.user,
          privileges: res.data.privileges,
          subscriptions: res.data.subscriptions,
          company: res.data.company,
          outlet: res.data.outlet,
          token_expired_at: res.data.token_expired_at,
          geolocation: res.data.geolocation,
        });
        router.push("/dashboard");
      }
    },
  });

  return {
    schema,
    form,
    mutation,
  };
}
