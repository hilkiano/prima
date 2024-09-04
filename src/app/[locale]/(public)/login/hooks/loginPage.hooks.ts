"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { handleLogin } from "@/services/auth.service";
import { useRouter } from "@/lib/navigation";
import { useUserContext } from "@/lib/userProvider";
import { JsonResponse } from "@/types/common.types";

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
    onSuccess: (
      res: JsonResponse<{
        user: User;
        privileges: string[] | null;
        subscriptions: Subscription[] | null;
        company: Company | null;
        outlet: Outlet | null;
        token_expired_at: string | null;
      }>
    ) => {
      if (res.code === 200) {
        setUserData({
          user: res.data.user,
          privileges: res.data.privileges,
          subscriptions: res.data.subscriptions,
          company: res.data.company,
          outlet: res.data.outlet,
          token_expired_at: res.data.token_expired_at,
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
