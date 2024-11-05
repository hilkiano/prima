"use client";

import { useLocale, useTranslations } from "next-intl";
import { FormHTMLAttributes, forwardRef, useEffect, useState } from "react";
import useProductUpdate from "../_hooks/product_update.hooks";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import ProductsFormField from "../../../add/_components/ProductsFormField";
import { Text, Button, List, Textarea, TextInput, Modal } from "@mantine/core";
import { IconDeviceFloppy, IconPackage, IconTrash } from "@tabler/icons-react";
import { showNotification } from "@/lib/errorHandler";
import { cleanData, formatFileSize, srcToFile } from "@/lib/helpers";
import ProductsImageThumbnail from "../../../add/_components/ProductsImageThumbnail";
import { Carousel } from "@mantine/carousel";
import ProductBatchCard from "./ProductBatchCard";
import { useDisclosure } from "@mantine/hooks";
import { format } from "@react-input/number-format";
import ProductBatchForm from "./ProductBatchForm";
import Compressor from "compressorjs";
import { useUserContext } from "@/lib/userProvider";
import { modals } from "@mantine/modals";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { notifications } from "@mantine/notifications";

dayjs.extend(utc);

type TProductVariantForm = {
  data?: ProductVariant;
  number?: number;
  singleVariant?: boolean;
  onFinish: () => void;
};

type TBatchForm = {
  base_capital_price: string;
  base_selling_price: string;
  stock: string;
  outlet_id: string;
  currency_id: number;
  expired_at?: Date | null | undefined;
};

const ProductVariantForm = forwardRef<
  HTMLFormElement,
  FormHTMLAttributes<HTMLFormElement> & TProductVariantForm
>(({ data, number, singleVariant, onFinish, ...props }, ref) => {
  const locale = useLocale();
  const tNotification = useTranslations("Notification");
  const tForm = useTranslations("Form");
  const tButton = useTranslations("Button");
  const t = useTranslations("Products");
  const { userData } = useUserContext();
  const [loading, setLoading] = useState(false);

  const {
    mutations,
    combobox,
    currency,
    currencyQuery,
    dataQuery,
    altCurrencyFormat,
  } = useProductUpdate();

  const schema = z
    .object({
      id: z.string(),
      label: z.string().max(50, tForm("validation_max_char", { max: 50 })),
      specifications: z.string(),
      images: z.custom<FileWithPath[]>(),
      batches: z
        .array(
          z
            .object({
              outlet_id: z.string(),
              stock: z.string(),
              currency_id: z.number(),
              base_capital_price: z.string(),
              base_selling_price: z
                .string()
                .min(1, tForm("validation_required")),
              expired_at: z.any().nullish(),
            })
            .superRefine((refine, ctx) => {
              // Selling price
              const sPrice = parseFloat(
                refine.base_selling_price
                  .replace(/[^\d.]/g, "")
                  .replace(/\./g, "")
              );
              const cPrice = parseFloat(
                refine.base_capital_price
                  .replace(/[^\d.]/g, "")
                  .replace(/\./g, "")
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
            })
        )
        .min(1, tForm("validation_required")),
    })
    .superRefine((refine, ctx) => {
      // Label cannot be empty
      if (refine.label === "" && dataQuery.data!.data.variants!.length > 1) {
        ctx.addIssue({
          path: ["label"],
          message: tForm("validation_required"),
          code: z.ZodIssueCode.custom,
        });
      }

      // Label must be unique
      const labelMap = new Map();
      dataQuery.data?.data.variants!.map((variant, id) => {
        labelMap.set(id, variant.label);
      });

      for (const [key, value] of labelMap) {
        if (value === refine.label && !data) {
          ctx.addIssue({
            path: ["label"],
            message: t("Add.validation_label"),
            code: z.ZodIssueCode.custom,
          });
          return key; // Found a duplicate value
        }
      }
    });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: "",
      label: "",
      specifications: "",
      images: [],
      batches: [],
    },
  });

  useEffect(() => {
    if (data) {
      form.setValue("id", data.id);
      form.setValue("label", data.label ?? "");
      form.setValue("specifications", data.specifications ?? "");
      form.setValue(
        "batches",
        data.batches!.map((batch) => {
          return {
            id: batch.id,
            outlet_id: batch.outlet_id,
            stock: format(batch.stock, {
              locales: locale,
            }),
            currency_id: batch.currency_id,
            base_capital_price: batch.base_capital_price
              ? format(batch.base_capital_price, {
                  locales: locale,
                  format: "currency",
                  currency: currencyQuery.data
                    ? currencyQuery.data.data.rows.find(
                        (currency) => currency.id === Number(batch.currency_id)
                      )?.currency
                    : "IDR",
                  maximumFractionDigits: 0,
                  currencyDisplay: altCurrencyFormat ? "symbol" : "code",
                })
              : "",
            base_selling_price: format(batch.base_selling_price, {
              locales: locale,
              format: "currency",
              currency: currencyQuery.data
                ? currencyQuery.data.data.rows.find(
                    (currency) => currency.id === Number(batch.currency_id)
                  )?.currency
                : "IDR",
              maximumFractionDigits: 0,
              currencyDisplay: altCurrencyFormat ? "symbol" : "code",
            }),
            expired_at: batch.expired_at,
          };
        })
      );
    }
  }, [data, altCurrencyFormat, currencyQuery.data, form, locale]);

  const batchesArray = useFieldArray({
    control: form.control,
    keyName: "batch_id",
    name: `batches`,
  });

  const createBatch = async (formData: TBatchForm) => {
    const mutateBatch = await mutations.createBatch.mutateAsync({
      class: "ProductBatch",
      payload: {
        payload: cleanData({
          product_variant_id: data?.id,
          base_capital_price: formData.base_capital_price
            ? parseInt(formData.base_capital_price.replace(/\D+/g, ""))
            : undefined,
          base_selling_price: parseInt(
            formData.base_selling_price.replace(/\D+/g, "")
          ),
          stock: parseInt(formData.stock.replace(/\D+/g, ""))
            ? parseInt(formData.stock.replace(/\D+/g, ""))
            : 0,
          expired_at: formData.expired_at ? formData.expired_at : undefined,
          outlet_id: userData?.outlet.id,
          currency_id: formData.currency_id,
        }),
      },
    });

    if (mutateBatch.status) {
      onFinish();
      close();
    }
  };

  const appendBatch = (data: TBatchForm) => {
    batchesArray.append(data);
    close();
  };

  const [opened, { open, close }] = useDisclosure(false);

  const createFormData = async (images: FileWithPath[]): Promise<FormData> => {
    const formData = new FormData();
    const index = dataQuery.data
      ? dataQuery.data.data.variants!.length + 1
      : "";
    const productId = dataQuery.data ? dataQuery.data.data.id : "";

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

  return (
    <>
      <form
        noValidate
        id={`product-variant-form-${number ? number : 0}`}
        className="flex flex-col gap-6 my-6"
        onSubmit={form.handleSubmit(async (formData) => {
          setLoading(true);

          if (data) {
            // UPDATE
            let uploadResult;
            if (formData.images.length > 0) {
              const imagesPayload = await createFormData(formData.images);
              uploadResult = await mutations.uploadImages.mutateAsync(
                imagesPayload
              );
            }

            const variantResult =
              await mutations.updateProductVariant.mutateAsync({
                class: "ProductVariant",
                payload: {
                  payload: cleanData({
                    id: formData.id,
                    label: formData.label,
                    specifications: formData.specifications,
                    pictures_url: uploadResult
                      ? ([
                          ...Object.values(uploadResult.data),
                          ...(data.pictures_url ?? []),
                        ] as string[])
                      : undefined,
                  }),
                },
              });

            if (variantResult.status) {
              setLoading(false);
              form.setValue("images", []);
              onFinish();
            }
          } else {
            // CREATE
            let uploadResult;
            if (formData.images.length > 0) {
              const imagesPayload = await createFormData(formData.images);
              uploadResult = await mutations.uploadImages.mutateAsync(
                imagesPayload
              );
            }

            const productId = dataQuery.data ? dataQuery.data.data.id : "";

            const variantResult = await mutations.createVariant.mutateAsync({
              class: "ProductVariant",
              payload: {
                payload: cleanData({
                  product_id: productId,
                  label: formData.label,
                  specifications: formData.specifications,
                  pictures_url: uploadResult
                    ? Object.values(uploadResult.data)
                    : undefined,
                }),
              },
            });

            if (variantResult.status) {
              const batchPromises = form
                .getValues("batches")
                .map(async (batch) => {
                  await mutations.createBatch.mutateAsync({
                    class: "ProductBatch",
                    payload: {
                      payload: {
                        product_variant_id: variantResult.data.id,
                        base_capital_price: batch.base_capital_price
                          ? parseInt(
                              batch.base_capital_price.replace(/\D+/g, "")
                            )
                          : undefined,
                        base_selling_price: parseInt(
                          batch.base_selling_price.replace(/\D+/g, "")
                        ),
                        stock: parseInt(batch.stock.replace(/\D+/g, ""))
                          ? parseInt(batch.stock.replace(/\D+/g, ""))
                          : 0,
                        expired_at: batch.expired_at
                          ? batch.expired_at
                          : undefined,
                        outlet_id: userData?.outlet.id,
                        currency_id: batch.currency_id,
                      },
                    },
                  });
                });

              await Promise.all(batchPromises).then((res) => {
                setLoading(false);
                onFinish();
              });
            }
          }
        })}
      >
        {data ? (
          <Text variant="gradient" className="m-0 uppercase font-bold">
            {t("Add.subtitle_variant", { no: number })}
          </Text>
        ) : (
          <></>
        )}

        <Controller
          name="label"
          control={form.control}
          render={({ field: { onChange, value } }) => (
            <ProductsFormField
              label={t("Add.label_label")}
              description={t("Add.description_label")}
              required
              field={
                <TextInput
                  className="w-full xs:w-[250px]"
                  error={form.formState.errors.label?.message}
                  autoComplete="off"
                  value={value ?? ""}
                  onChange={onChange}
                  maxLength={50}
                  required
                  rightSection={
                    <div className="text-sm">
                      {form.getValues("label").length}
                      /50
                    </div>
                  }
                  rightSectionWidth={48}
                />
              }
            />
          )}
        />
        <Controller
          name="specifications"
          control={form.control}
          render={({ field: { onChange, value } }) => (
            <ProductsFormField
              label={t("Add.label_specifications")}
              description={t("Add.description_specifications")}
              field={
                <Textarea
                  error={form.formState.errors.specifications?.message}
                  autoComplete="off"
                  value={value ?? ""}
                  onChange={onChange}
                  autosize
                  minRows={4}
                  className="w-full"
                />
              }
            />
          )}
        />

        <Controller
          name="images"
          control={form.control}
          render={({ field: { onChange, value } }) => (
            <ProductsFormField
              label={t("Add.label_images")}
              description={t("Add.description_images")}
              field={
                <div className="flex flex-col gap-2 w-full">
                  <Dropzone
                    accept={IMAGE_MIME_TYPE}
                    onReject={(fileRejections) => {
                      showNotification(
                        "yellow",
                        tNotification("title_error"),
                        fileRejections.length > 6 ? (
                          tForm("validation_max_image", { count: 6 })
                        ) : (
                          <List>
                            {fileRejections.map((file, idx) =>
                              file.errors[0].code === "file-too-large" ? (
                                <List.Item key={idx}>
                                  {t("Add.validation_image_size", {
                                    name: file.file.name,
                                    size: formatFileSize(3145728),
                                  })}
                                </List.Item>
                              ) : (
                                <></>
                              )
                            )}
                          </List>
                        )
                      );
                    }}
                    onDrop={(f) => {
                      const currentImages = form.getValues("images");
                      if (currentImages) {
                        if (currentImages.length + f.length > 6) {
                          showNotification(
                            "yellow",
                            tNotification("title_error"),
                            tForm("validation_max_image", { count: 6 })
                          );
                        } else {
                          form.setValue("images", [...currentImages, ...f]);
                        }
                      } else {
                        form.setValue("images", f);
                      }
                    }}
                    className="h-24"
                    maxFiles={6}
                    maxSize={3145728}
                  >
                    <Text className="opacity-60 font-light italic">
                      {t("Add.body_dropzone")}
                    </Text>
                  </Dropzone>
                  <div className="w-full mt-2 flex gap-4 flex-wrap">
                    {form.watch("images")?.map((file, index) => {
                      const imageUrl = URL.createObjectURL(file);
                      return (
                        <ProductsImageThumbnail
                          image={imageUrl}
                          removeFn={() => {
                            const currentImages = form.getValues("images");
                            if (currentImages) {
                              currentImages.splice(index, 1);
                            }

                            form.setValue("images", currentImages);
                          }}
                          key={index}
                          className="w-24 h-24 opacity-60 hover:opacity-100 transition-opacity cursor-pointer relative"
                        />
                      );
                    })}
                    {data?.pictures_url ? (
                      data.pictures_url.map((url, index) => (
                        <ProductsImageThumbnail
                          key={index + 100}
                          image={url as string}
                          removeFn={async () => {
                            const urlString = url as string;
                            const image = new URL(urlString);
                            await mutations.deleteImages
                              .mutateAsync({
                                disk: "s3",
                                paths: [image.pathname],
                              })
                              .then(() => {
                                const filtered = data.pictures_url.filter(
                                  (u) => u !== urlString
                                );
                                mutations.updateProductVariant.mutate({
                                  class: "ProductVariant",
                                  payload: {
                                    payload: cleanData({
                                      id: data.id,
                                      pictures_url: filtered as string[],
                                    }),
                                  },
                                });
                              });
                          }}
                          className="w-24 h-24 opacity-60 hover:opacity-100 transition-opacity cursor-pointer relative"
                        />
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              }
            />
          )}
        />
        <ProductsFormField
          label={t("Add.field_batch")}
          required
          description={t.rich("Add.description_batch", {
            bold: (chunks) => <span className="font-bold">{chunks}</span>,
          })}
          field={
            <div className="flex flex-col mb-4 w-full">
              <div className="flex gap-4 self-start items-center">
                {userData?.privileges.includes("DATA_CREATE_PRODUCT_BATCH") ? (
                  <Button
                    variant="light"
                    leftSection={<IconPackage />}
                    type="button"
                    color={
                      form.formState.errors.batches?.message ? "red" : undefined
                    }
                    onClick={open}
                  >
                    {t("Add.btn_add_batch")}
                  </Button>
                ) : (
                  <></>
                )}

                <Text className="opacity-70">
                  Total: {form.getValues("batches").length}
                </Text>
              </div>
              <Carousel
                slideSize={400}
                slideGap="lg"
                slidesToScroll={1}
                containScroll="trimSnaps"
                withControls={false}
                dragFree
                classNames={{
                  viewport: "mt-6",
                }}
              >
                {data
                  ? data.batches!.map((batch, batchId) => (
                      <Carousel.Slide key={batchId}>
                        <ProductBatchCard
                          className="p-4 rounded-lg bg-slate-300/70 dark:bg-slate-800 h-[160px] relative select-none"
                          batch={{
                            outlet_id: batch.outlet_id,
                            stock: format(batch.stock, {
                              locales: locale,
                            }),
                            currency_id: batch.currency_id,
                            base_capital_price: batch.base_capital_price
                              ? format(batch.base_capital_price, {
                                  locales: locale,
                                  format: "currency",
                                  currency: currencyQuery.data
                                    ? currencyQuery.data.data.rows.find(
                                        (currency) =>
                                          currency.id ===
                                          Number(batch.currency_id)
                                      )?.currency
                                    : "IDR",
                                  maximumFractionDigits: 0,
                                  currencyDisplay: altCurrencyFormat
                                    ? "symbol"
                                    : "code",
                                })
                              : "",
                            base_selling_price: format(
                              batch.base_selling_price,
                              {
                                locales: locale,
                                format: "currency",
                                currency: currencyQuery.data
                                  ? currencyQuery.data.data.rows.find(
                                      (currency) =>
                                        currency.id ===
                                        Number(batch.currency_id)
                                    )?.currency
                                  : "IDR",
                                maximumFractionDigits: 0,
                                currencyDisplay: altCurrencyFormat
                                  ? "symbol"
                                  : "code",
                              }
                            ),
                            expired_at: batch.expired_at
                              ? dayjs(batch.expired_at).toDate()
                              : null,
                          }}
                          batchId={batchId}
                          outlets={combobox.outlets}
                          productForm={form}
                          varId={0}
                          currency={currency}
                          productCurrencies={combobox.productCurrencies}
                          currencyQuery={currencyQuery}
                          altCurrencyFormat={altCurrencyFormat}
                          updateFn={async (data) => {
                            await mutations.updateProductBatch.mutateAsync({
                              class: "ProductBatch",
                              payload: {
                                payload: cleanData({
                                  id: batch.id,
                                  base_capital_price: data.base_capital_price
                                    ? parseInt(
                                        data.base_capital_price.replace(
                                          /\D+/g,
                                          ""
                                        )
                                      )
                                    : undefined,
                                  base_selling_price: parseInt(
                                    data.base_selling_price.replace(/\D+/g, "")
                                  ),
                                  stock: parseInt(
                                    data.stock.replace(/\D+/g, "")
                                  )
                                    ? parseInt(data.stock.replace(/\D+/g, ""))
                                    : 0,
                                  expired_at: data.expired_at,
                                  outlet_id: userData?.outlet.id,
                                  currency_id: data.currency_id,
                                }),
                              },
                            });
                          }}
                          deleteFn={() => {
                            if (data.batches!.length > 1) {
                              modals.openConfirmModal({
                                centered: true,
                                title: t("Update.btn_remove"),
                                children: (
                                  <p className="m-0">
                                    {t("Update.modal_remove_batch")}
                                  </p>
                                ),
                                labels: {
                                  confirm: tButton("yes"),
                                  cancel: tButton("no"),
                                },
                                onCancel: () => {},
                                onConfirm: () => {
                                  mutations.forceDelete.mutate({
                                    model: [
                                      {
                                        class: "ProductBatch",
                                        id: batch.id,
                                      },
                                    ],
                                  });
                                },
                              });
                            } else {
                              notifications.show({
                                color: "yellow",
                                message: t("Update.notification_batch"),
                              });
                            }
                          }}
                        />
                      </Carousel.Slide>
                    ))
                  : form.getValues("batches").map((batch, batchId) => (
                      <Carousel.Slide key={batchId}>
                        <ProductBatchCard
                          className="p-4 rounded-lg bg-slate-300/70 dark:bg-slate-800 h-[160px] relative select-none"
                          batch={batch}
                          batchId={batchId}
                          outlets={combobox.outlets}
                          productForm={form}
                          varId={0}
                          currency={currency}
                          productCurrencies={combobox.productCurrencies}
                          currencyQuery={currencyQuery}
                          altCurrencyFormat={altCurrencyFormat}
                        />
                      </Carousel.Slide>
                    ))}
              </Carousel>
            </div>
          }
        />
        <div className="mt-4 flex flex-col xs:flex-row gap-4 self-end">
          {data &&
          (dataQuery.data
            ? dataQuery.data.data.variants!.length > 1
            : false) ? (
            <Button
              color="red"
              variant="filled"
              leftSection={<IconTrash />}
              disabled={
                !userData?.privileges.includes("DATA_DELETE_PRODUCT_VARIANT")
              }
              type="button"
              size="md"
              onClick={() => {
                modals.openConfirmModal({
                  centered: true,
                  title: t("Update.btn_remove"),
                  children: (
                    <p className="m-0">
                      {t.rich("Update.modal_remove_variant", {
                        emp: (chunks) => (
                          <span className="font-bold">{chunks}</span>
                        ),
                        label: data.label,
                      })}
                    </p>
                  ),
                  labels: {
                    confirm: tButton("yes"),
                    cancel: tButton("no"),
                  },
                  onCancel: () => {},
                  onConfirm: () => {
                    mutations.forceDelete.mutate({
                      model: [
                        {
                          class: "ProductVariant",
                          id: data.id,
                        },
                        ...data.batches!.map((batch) => {
                          return {
                            class: "ProductBatch",
                            id: batch.id,
                          };
                        }),
                      ],
                    });
                  },
                });
              }}
            >
              {t("Update.btn_remove")}
            </Button>
          ) : (
            <></>
          )}

          <Button
            variant="gradient"
            leftSection={<IconDeviceFloppy />}
            type="submit"
            size="md"
            loading={loading}
            disabled={
              !userData?.privileges.includes("DATA_UPDATE_PRODUCT_VARIANT")
            }
          >
            {tButton("save")}
          </Button>
        </div>
      </form>

      <Modal opened={opened} onClose={close} title={t("Add.title_batch_form")}>
        <ProductBatchForm
          variantForm={form}
          submitFn={data ? createBatch : appendBatch}
        />
      </Modal>
    </>
  );
});

ProductVariantForm.displayName = "ProductVariantForm";
export default ProductVariantForm;
