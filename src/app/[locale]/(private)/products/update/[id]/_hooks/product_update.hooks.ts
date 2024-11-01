"use client";

import { useUserContext } from "@/lib/userProvider";
import { getFn, updateFn } from "@/services/crud.service";
import { getList } from "@/services/list.service";
import { JsonResponse, ListResult } from "@/types/common.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ComboboxData } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

type TUpdate<T> = {
  class: string;
  payload: Partial<T>;
};

export default function useProductUpdate() {
  const tForm = useTranslations("Form");
  const t = useTranslations("Products");
  const params = useParams();

  // Default config
  const { userData } = useUserContext();
  const [altCurrencyFormat, setAltCurrencyFormat] = useState<boolean>(
    userData?.outlet.configs?.currency
      ? userData?.outlet.configs?.currency.is_alternate
      : userData?.company.configs?.currency
      ? userData?.company.configs?.currency.is_alternate
      : false
  );
  const [currency, setCurrency] = useState<number>(
    userData?.outlet.configs?.currency
      ? userData?.outlet.configs?.currency.id
      : userData?.company.configs?.currency
      ? userData?.company.configs?.currency.id
      : 1
  );

  // States
  const [productCategories, setProductCategories] = useState<ComboboxData>([]);
  const [productCurrencies, setProductCurrencies] = useState<ComboboxData>([]);
  const [outlets, setOutlets] = useState<ComboboxData>([]);

  // Queries
  const queryClient = useQueryClient();
  const dataQuery = useQuery({
    queryKey: ["productData", params.id],
    queryFn: () =>
      getFn<Product>({
        class: "Product",
        id: params.id as string,
        relations:
          "category&variants.batches.outlet&variants.batches.currency&createdUser&updatedUser",
      }),
    refetchOnReconnect: false,
  });

  const categoryQuery = useQuery<JsonResponse<ListResult<ProductCategory[]>>>({
    queryFn: async () => {
      return getList({
        model: "ProductCategory",
        limit: "99999",
        sort: "name",
        sort_direction: "asc",
      });
    },
    queryKey: ["categoryList"],
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const currencyQuery = useQuery<JsonResponse<ListResult<Currency[]>>>({
    queryFn: async () => {
      return getList({
        model: "Currency",
        limit: "99999",
        sort: "id",
        sort_direction: "asc",
      });
    },
    queryKey: ["currencyList"],
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const outletQuery = useQuery<JsonResponse<ListResult<Outlet[]>>>({
    queryFn: async () => {
      return getList({
        model: "Outlet",
        limit: "99999",
        sort: "name",
        sort_direction: "asc",
      });
    },
    queryKey: ["outletList"],
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Types
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

  // Form
  const labelMap = new Map();
  const schema = z.object({
    id: z.string(),
    type: z.enum(productTypeEnum, {
      required_error: tForm("validation_required"),
    }),
    name: z
      .string()
      .min(8, tForm("validation_min_char", { min: 8 }))
      .max(255, tForm("validation_max_char", { max: 255 })),
    details: z.string(),
    product_category_id: z.string().nullish(),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: "",
      type: "PHYSICAL",
      name: "",
      details: "",
      product_category_id: null,
    },
    mode: "onTouched",
  });

  // Functions
  const filterCategory = (type: string) => {
    const filteredCategories =
      categoryQuery.data?.data.rows.filter(
        (row) => row.type === type || row.type === null
      ) ?? [];
    const comboboxData = filteredCategories.map((row) => {
      return {
        label: row.name,
        value: row.id,
      };
    });

    if (
      form.getValues("product_category_id") &&
      !filteredCategories?.find(
        (row) => row.id === form.getValues("product_category_id")
      )
    ) {
      form.setValue("product_category_id", undefined);
    }

    setProductCategories(comboboxData);
  };

  // Mutations
  const updateProduct = useMutation({
    mutationFn: (data: {
      class: "Product";
      payload: { payload: Required<Pick<Product, "id">> & Partial<Product> };
    }) => updateFn<TUpdate<Product>, Product>(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["productData", params.id] });
      notifications.show({
        color: "blue",
        message: t("Update.notification_success"),
      });
    },
  });

  const updateProductVariant = useMutation({
    mutationFn: (data: {
      class: "ProductVariant";
      payload: {
        payload: Required<Pick<ProductVariant, "id">> & Partial<ProductVariant>;
      };
    }) => updateFn<TUpdate<ProductVariant>, ProductVariant>(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["productData", params.id] });
      notifications.show({
        color: "blue",
        message: t("Update.notification_success"),
      });
    },
  });

  const updateProductBatch = useMutation({
    mutationFn: (data: {
      class: "ProductBatch";
      payload: {
        payload: Required<Pick<ProductBatch, "id">> & Partial<ProductBatch>;
      };
    }) => updateFn<TUpdate<ProductBatch>, ProductBatch>(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["productData", params.id] });
      notifications.show({
        color: "blue",
        message: t("Update.notification_success"),
      });
    },
  });

  // Fill form fields
  useEffect(() => {
    if (dataQuery.data) {
      form.setValue("id", dataQuery.data.data.id);
      form.setValue("type", dataQuery.data.data.type);
      form.setValue("name", dataQuery.data.data.name);
      form.setValue("details", dataQuery.data.data.details ?? "");
      form.setValue(
        "product_category_id",
        dataQuery.data.data.product_category_id
      );
    }
  }, [dataQuery.data, form]);

  // Create combobox data
  useEffect(() => {
    if (categoryQuery.data) {
      setProductCategories(
        categoryQuery.data?.data.rows
          .filter(
            (row) => row.type === form.getValues("type") || row.type === null
          )
          .map((row) => {
            return {
              label: row.name,
              value: row.id,
            };
          })
      );
    }

    if (currencyQuery.data) {
      setProductCurrencies(
        currencyQuery.data?.data.rows.map((row) => {
          return {
            label: row.currency,
            value: String(row.id),
          };
        })
      );
    }

    if (outletQuery.data) {
      setOutlets(
        outletQuery.data.data.rows.map((row) => {
          return {
            label: row.name,
            value: row.id,
          };
        })
      );
    }
  }, [
    categoryQuery.data,
    currencyQuery.data,
    outletQuery.data,
    userData,
    form,
  ]);

  return {
    dataQuery,
    currencyQuery,
    combobox: {
      productCategories,
      productCurrencies,
      productTypes,
      outlets,
    },
    form,
    functions: {
      filterCategory,
    },
    mutations: {
      updateProduct,
      updateProductVariant,
      updateProductBatch,
    },
    currency,
    altCurrencyFormat,
  };
}