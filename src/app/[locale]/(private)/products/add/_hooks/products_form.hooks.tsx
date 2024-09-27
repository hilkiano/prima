"use client";

import React from "react";
import { getList } from "@/services/list.service";
import { JsonResponse, ListResult } from "@/types/common.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, ComboboxData } from "@mantine/core";
import { useUserContext } from "@/lib/userProvider";
import { FileWithPath } from "@mantine/dropzone";
import {
  createFn,
  forceDeleteFn,
  TForceDeleteReq,
} from "@/services/crud.service";
import { cleanData, srcToFile } from "@/lib/helpers";
import { bulkUpload } from "@/services/storage.service";
import Compressor from "compressorjs";
import { showNotification } from "@/lib/errorHandler";
import { reject } from "lodash";

type TCreateProduct = {
  class: string;
  payload: Partial<Product>;
};

type TCreateProductBatch = {
  class: string;
  payload: Partial<ProductBatch>;
};

type TCreateProductVariant = {
  class: string;
  payload: Partial<ProductVariant>;
};

export default function useProductsForm() {
  const tForm = useTranslations("Form");
  const t = useTranslations("Products");
  const [productCategories, setProductCategories] =
    React.useState<ComboboxData>([]);
  const [productCurrencies, setProductCurrencies] =
    React.useState<ComboboxData>([]);
  const { userData } = useUserContext();
  const [currency, setCurrency] = React.useState<string>("IDR");
  const [altCurrencyFormat, setAltCurrencyFormat] =
    React.useState<boolean>(false);
  const [totalMutation, setTotalMutation] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [mutationStatus, setMutationStatus] = React.useState<
    {
      action: string;
      id: string | null;
      status: boolean;
    }[]
  >([]);
  const [isError, setIsError] = React.useState(false);

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

  type TProductType = (typeof productTypes)[number]["value"];
  const productTypeEnum: [TProductType, ...TProductType[]] = [
    productTypes[0].value,
    ...productTypes.slice(1).map((p) => p.value),
  ];

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
    variants: z.array(
      z
        .object({
          id: z.string(),
          label: z.string().max(50, tForm("validation_max_char", { max: 50 })),
          specifications: z.string(),
          base_capital_price: z.string(),
          base_selling_price: z.string().min(1, tForm("validation_required")),
          stock: z.string().min(1, tForm("validation_required")),
          expired_at: z.date().nullish(),
          images: z.custom<FileWithPath[]>(),
        })
        .superRefine((refine, ctx) => {
          // Selling price
          const sPrice = parseInt(
            refine.base_selling_price.replace(/[.,]/g, "")
          );
          const cPrice = parseInt(
            refine.base_capital_price.replace(/[.,]/g, "")
          );
          if (cPrice >= sPrice) {
            if (refine.base_selling_price) {
              ctx.addIssue({
                path: ["base_selling_price"],
                message: t("Add.validation_selling_price"),
                code: z.ZodIssueCode.custom,
              });
            }
          }

          // Label cannot be empty
          if (refine.label === "" && form.getValues("variants").length > 1) {
            ctx.addIssue({
              path: ["label"],
              message: tForm("validation_required"),
              code: z.ZodIssueCode.custom,
            });
          }

          // Label must be unique
          if (form.getValues("variants").length > 1) {
            form.getValues("variants").map((variant, id) => {
              labelMap.set(id, variant.label);
            });

            const valueCount = new Map();

            for (const [key, value] of labelMap) {
              if (valueCount.has(value)) {
                ctx.addIssue({
                  path: ["label"],
                  message: t("Add.validation_label"),
                  code: z.ZodIssueCode.custom,
                });
                return key; // Found a duplicate value
              }
              valueCount.set(value, 1);
            }
          }
        })
    ),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: "",
      type: "PHYSICAL",
      name: "",
      details: "",
      product_category_id: null,
      variants: [
        {
          id: "",
          label: "",
          specifications: "",
          base_capital_price: "",
          base_selling_price: "",
          stock: "",
          expired_at: undefined,
          images: [],
        },
      ],
    },
    mode: "onTouched",
  });

  const variantsArray = useFieldArray({
    control: form.control,
    keyName: "array_id",
    name: "variants",
  });

  React.useEffect(() => {
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
            value: row.currency,
          };
        })
      );

      if (userData?.outlet.configs?.currency) {
        const defaultOutletCurrency = currencyQuery.data.data.rows.find(
          (row) => row.id === userData.outlet.configs?.currency?.id
        );
        if (defaultOutletCurrency) {
          setCurrency(defaultOutletCurrency.currency);
          setAltCurrencyFormat(userData.outlet.configs.currency.is_alternate);
        }
      } else if (userData?.company.configs?.currency) {
        const defaultCompanyCurrency = currencyQuery.data.data.rows.find(
          (row) => row.id === userData.company.configs?.currency?.id
        );
        if (defaultCompanyCurrency) {
          setCurrency(defaultCompanyCurrency.currency);
          setAltCurrencyFormat(userData.company.configs.currency.is_alternate);
        }
      }
    }
  }, [categoryQuery.data, currencyQuery.data, userData, form]);

  const mutationVariant = useMutation({
    mutationFn: (data: {
      class: "ProductVariant";
      payload: { payload: Partial<ProductVariant> };
    }) => createFn<TCreateProductVariant, ProductVariant>(data),
  });

  const mutationBatch = useMutation({
    mutationFn: (data: {
      class: "ProductBatch";
      payload: { payload: Partial<ProductBatch> };
    }) => createFn<TCreateProductBatch, ProductBatch>(data),
  });

  const createFormData = async (
    index: number,
    productId: string,
    images: FileWithPath[]
  ): Promise<FormData> => {
    const formData = new FormData();
    formData.append("directory", `products/${productId}/${index}`);

    const imagePromises = images.map(async (image, j) => {
      return new Promise<File | Blob>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = async () => {
          const string = reader.result;
          if (string) {
            const file = await srcToFile(
              string as string,
              `${productId}-${j}.webp`,
              "image/webp"
            );

            new Compressor(file, {
              quality: 0.6,
              success: (result) => {
                resolve(result);
              },
            });
          }
        };
      });
    });

    await Promise.all(imagePromises).then((files) => {
      files.map((file, j) => {
        formData.append(`files[${j}]`, file, `${productId}-${j}.webp`);
      });
    });
    return formData;
  };

  const mutationProduct = useMutation({
    mutationFn: (data: {
      class: "Product";
      payload: { payload: Partial<Product> };
    }) => createFn<TCreateProduct, Product>(data),
    onSuccess: async (data) => {
      let complete = 1;
      setMutationStatus((prev) => [
        ...prev,
        {
          action: "Product",
          id: data.status ? data.data.id : null,
          status: data.status,
        },
      ]);
      if (data.status) {
        setProgress(complete / totalMutation);

        const mutationPromises = form
          .getValues("variants")
          .map(async (variant, i) => {
            return new Promise<boolean>(async (resolve, reject) => {
              if (variant.images.length > 0) {
                const formData = await createFormData(
                  i,
                  data.data.id,
                  variant.images
                );
                const uploadResult = await mutationUpload.mutateAsync(formData);
                setMutationStatus((prev) => [
                  ...prev,
                  {
                    action: "Pictures",
                    id: null,
                    status: uploadResult.status,
                  },
                ]);
                if (uploadResult.status) {
                  complete = complete + 1;
                  setProgress(complete / totalMutation);
                } else {
                  reject(false);
                }
                const urls = Object.values(uploadResult.data);
                const variantResult = await mutationVariant.mutateAsync({
                  class: "ProductVariant",
                  payload: {
                    payload: cleanData({
                      product_id: data.data.id,
                      label: variant.label,
                      specifications: variant.specifications,
                      outlet_id: userData?.outlet.id,
                      pictures_url: urls,
                    }),
                  },
                });
                setMutationStatus((prev) => [
                  ...prev,
                  {
                    action: "ProductVariant",
                    id: variantResult.status ? variantResult.data.id : null,
                    status: variantResult.status,
                  },
                ]);
                if (variantResult.status) {
                  complete = complete + 1;
                  setProgress(complete / totalMutation);
                  const batchResult = await mutationBatch.mutateAsync({
                    class: "ProductBatch",
                    payload: {
                      payload: cleanData({
                        product_variant_id: variantResult.data.id,
                        base_capital_price: variant.base_capital_price
                          ? parseInt(
                              variant.base_capital_price.replace(/\D+/g, "")
                            )
                          : undefined,
                        base_selling_price: parseInt(
                          variant.base_selling_price.replace(/\D+/g, "")
                        ),
                        stock: parseInt(variant.stock.replace(/\D+/g, "")),
                        expired_at: variant.expired_at
                          ? variant.expired_at
                          : undefined,
                        outlet_id: userData?.outlet.id,
                      }),
                    },
                  });
                  setMutationStatus((prev) => [
                    ...prev,
                    {
                      action: "ProductBatch",
                      id: batchResult.status ? batchResult.data.id : null,
                      status: batchResult.status,
                    },
                  ]);

                  if (batchResult.status) {
                    complete = complete + 1;
                    setProgress(complete / totalMutation);
                    resolve(true);
                  } else {
                    reject(false);
                  }
                } else {
                  reject(false);
                }
              } else {
                const variantResult = await mutationVariant.mutateAsync({
                  class: "ProductVariant",
                  payload: {
                    payload: cleanData({
                      product_id: data.data.id,
                      label: variant.label,
                      specifications: variant.specifications,
                      outlet_id: userData?.outlet.id,
                    }),
                  },
                });
                setMutationStatus((prev) => [
                  ...prev,
                  {
                    action: "ProductVariant",
                    id: variantResult.status ? variantResult.data.id : null,
                    status: variantResult.status,
                  },
                ]);
                if (variantResult.status) {
                  complete = complete + 1;
                  setProgress(complete / totalMutation);
                  const batchResult = await mutationBatch.mutateAsync({
                    class: "ProductBatch",
                    payload: {
                      payload: cleanData({
                        product_variant_id: variantResult.data.id,
                        base_capital_price: variant.base_capital_price
                          ? parseInt(
                              variant.base_capital_price.replace(/\D+/g, "")
                            )
                          : undefined,
                        base_selling_price: parseInt(
                          variant.base_selling_price.replace(/\D+/g, "")
                        ),
                        stock: parseInt(variant.stock.replace(/\D+/g, "")),
                        expired_at: variant.expired_at
                          ? variant.expired_at
                          : undefined,
                        outlet_id: userData?.outlet.id,
                      }),
                    },
                  });
                  setMutationStatus((prev) => [
                    ...prev,
                    {
                      action: "ProductBatch",
                      id: batchResult.status ? batchResult.data.id : null,
                      status: batchResult.status,
                    },
                  ]);
                  if (batchResult.status) {
                    complete = complete + 1;
                    setProgress(complete / totalMutation);
                    resolve(true);
                  } else {
                    reject(false);
                  }
                } else {
                  reject(false);
                }
              }
            });
          });

        await Promise.all(mutationPromises)
          .then((res) => {
            let imageUrl: string | null = null;
            if (form.getValues("variants")[0].images.length > 0) {
              imageUrl = URL.createObjectURL(
                form.getValues("variants")[0].images[0]
              );
            }

            showNotification(
              "green",
              t("Add.title_success_create"),
              t.rich("Add.message_success_create", {
                bold: (chunks) => <span className="font-bold">{chunks}</span>,
                name: form.getValues("name"),
              }),
              imageUrl ? (
                <Avatar
                  radius="md"
                  size="md"
                  src={imageUrl}
                  alt={form.getValues("name")}
                />
              ) : undefined
            );

            form.reset();
          })
          .catch((err) => {
            setIsError(true);
          });
      }
    },
  });

  const rollbackMutation = () => {
    const payload: TForceDeleteReq = {
      model: [],
    };
    mutationStatus
      .filter(
        (mutation) =>
          mutation.status !== false && mutation.action !== "Pictures"
      )
      .map((mutation) =>
        payload.model.push({
          class: mutation.action,
          id: mutation.id ? mutation.id : 0,
        })
      );

    mutationForceDelete.mutate(payload);
  };

  const mutationUpload = useMutation({
    mutationFn: bulkUpload,
  });

  const mutationForceDelete = useMutation({
    mutationFn: forceDeleteFn,
    onSuccess: (res) => {
      setProgress(0);
      setMutationStatus([]);
      setIsError(false);
    },
  });

  return {
    form,
    productTypes,
    productCategories,
    productCurrencies,
    filterCategory,
    variantsArray,
    currency,
    setCurrency,
    altCurrencyFormat,
    mutationProduct,
    totalMutation,
    setTotalMutation,
    progress,
    setProgress,
    setMutationStatus,
    isError,
    setIsError,
    rollbackMutation,
  };
}
