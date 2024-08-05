"use client";

import { useTranslations } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

export default function useOnboardingTnc() {
  const t = useTranslations("Form");

  const viewport = React.useRef<HTMLDivElement>(null);
  const [scrollPosition, onScrollPositionChange] = React.useState({
    x: 0,
    y: 0,
  });

  const schema = z.object({
    agreed: z
      .boolean()
      .refine((value) => value === true, t("validation_tnc_agreement")),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      agreed: false,
    },
  });

  return {
    schema,
    form,
    viewport,
    scrollPosition,
    onScrollPositionChange,
  };
}
