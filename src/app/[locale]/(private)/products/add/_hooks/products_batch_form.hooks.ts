"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function useProductsBatchForm(
  currency: number,
  data?: {
    outlet_id: string;
    stock: string;
    is_infinite_stock: boolean;
    currency_id: number;
    base_capital_price: string;
    base_selling_price: string;
    expired_at?: Date | null | undefined;
  }
) {
  const tForm = useTranslations("Form");
  const t = useTranslations("Products.Add");

  const schema = z
    .object({
      outlet_id: z.string().min(1, tForm("validation_required")),
      stock: z.string(),
      is_infinite_stock: z.boolean(),
      currency_id: z.number(),
      base_capital_price: z.string(),
      base_selling_price: z.string().min(1, tForm("validation_required")),
      expired_at: z.date().nullish(),
    })
    .superRefine((refine, ctx) => {
      // Stock
      if (!refine.is_infinite_stock && refine.stock === "") {
        ctx.addIssue({
          path: ["stock"],
          message: tForm("validation_required"),
          code: z.ZodIssueCode.custom,
        });
      }

      // Selling price
      const sPrice = parseFloat(
        refine.base_selling_price.replace(/[^\d.]/g, "").replace(/\./g, "")
      );
      const cPrice = parseFloat(
        refine.base_capital_price.replace(/[^\d.]/g, "").replace(/\./g, "")
      );
      if (cPrice >= sPrice) {
        if (refine.base_selling_price) {
          ctx.addIssue({
            path: ["base_selling_price"],
            message: t("validation_selling_price"),
            code: z.ZodIssueCode.custom,
          });
        }
      }
    });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      outlet_id: data ? data.outlet_id : "",
      base_capital_price: data ? data.base_capital_price : "",
      base_selling_price: data ? data.base_selling_price : "",
      currency_id: data ? data.currency_id : currency,
      stock: data ? data.stock : "",
      is_infinite_stock: data ? data.is_infinite_stock : false,
      expired_at: data ? data.expired_at : null,
    },
  });

  return {
    form,
  };
}
