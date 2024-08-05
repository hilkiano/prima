"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { handleLogin } from "@/services/auth.service";
import { useGlobalMessageContext } from "@/lib/globalMessageProvider";
import { useRouter } from "@/lib/navigation";
import { useUserContext } from "@/lib/userProvider";

export default function useLoginPage() {
  const t = useTranslations("Public.Login");
  const { message } = useGlobalMessageContext();
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
    mutationFn: (data: z.infer<typeof schema>) => handleLogin(message, data),
    onSuccess: (
      res: JsonResponse<{
        user: User;
        privileges: string[] | null;
        subscriptions: Subscription[] | null;
      }>
    ) => {
      if (res.code === 200) {
        setUserData({
          user: res.data.user,
          privileges: res.data.privileges,
          subscriptions: res.data.subscriptions,
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
