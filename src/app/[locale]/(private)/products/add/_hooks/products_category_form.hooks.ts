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

  const schema = z.object({
    id: z.string(),
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
      name: "",
    },
  });

  return {
    form,
    mutation,
  };
}
