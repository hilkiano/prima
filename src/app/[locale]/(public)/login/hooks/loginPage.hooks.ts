"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { handleLogin } from "@/services/auth.service";
import { useGlobalMessageContext } from "@/lib/globalMessageProvider";

export default function useLoginPage() {
  const t = useTranslations("Public.Login");
  const { message } = useGlobalMessageContext();

  const schema = z.object({
    email: z.string().min(1, t("email_min_validation")),
    password: z.string().min(1, t("password_min_validation")),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof schema>) => handleLogin(message, data),
    onSuccess: (res: JsonResponse<string>) => {
      // login to dashboard
    },
  });

  return {
    schema,
    form,
    mutation,
  };
}
