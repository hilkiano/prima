"use client";

import { createFn } from "@/services/crud.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

type TCreateProductCategory = {
  class: string;
  payload: Partial<ProductCategory>;
};

export default function useProductsCategoryForm(onFinish: () => void) {
  const tForm = useTranslations("Form");
  const t = useTranslations("Products");
  const queryClient = useQueryClient();

  const productTypes = [
    {
      label: t("type_physical"),
      value: "PHYSICAL",
    },
    {
      label: t("type_virtual"),
      value: "VIRTUAL",
    },
    {
      label: t("type_service"),
      value: "SERVICE",
    },
    {
      label: t("type_subscription"),
      value: "SUBSCRIPTION",
    },
  ] as const;

  type TProductType = (typeof productTypes)[number]["value"];
  const productTypeEnum: [TProductType, ...TProductType[]] = [
    productTypes[0].value,
    ...productTypes.slice(1).map((p) => p.value),
  ];

  const schema = z.object({
    id: z.string(),
    type: z
      .enum(productTypeEnum, {
        required_error: tForm("validation_required"),
      })
      .nullish(),
    name: z
      .string()
      .min(1, tForm("validation_required"))
      .max(50, tForm("validation_max_char", { max: 50 })),
  });

  const mutation = useMutation({
    mutationFn: (data: {
      class: "ProductCategory";
      payload: { payload: Partial<ProductCategory> };
    }) => createFn<TCreateProductCategory, ProductCategory>(data),
    onSuccess: (res) => {
      if (res.status) {
        queryClient.invalidateQueries({ queryKey: ["categoryList"] });
        onFinish();
      }
    },
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: "",
      type: null,
      name: "",
    },
  });

  return {
    form,
    productTypes,
    mutation,
  };
}
