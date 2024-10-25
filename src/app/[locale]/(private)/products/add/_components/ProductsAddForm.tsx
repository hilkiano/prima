"use client";

import {
  ActionIcon,
  Box,
  BoxProps,
  Button,
  Divider,
  Modal,
  Select,
  Textarea,
  TextInput,
  Tooltip,
  Text,
  useMantineTheme,
  List,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useLocale, useTranslations } from "next-intl";
import React, { useState } from "react";
import useProductsForm from "../_hooks/products_form.hooks";
import { Controller } from "react-hook-form";
import ProductsFormField from "./ProductsFormField";
import {
  IconCircleMinus,
  IconDeviceFloppy,
  IconPackage,
  IconPlus,
} from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import ProductsCategoryForm from "./ProductsCategoryForm";
import { useUserContext } from "@/lib/userProvider";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

import "dayjs/locale/id";
import { showNotification } from "@/lib/errorHandler";
import { cleanData, formatFileSize } from "@/lib/helpers";
import ProductsImageThumbnail from "./ProductsImageThumbnail";
import ProgressDialog from "@/components/dialogs/ProgressDialog";
import ProductsBatchForm from "./ProductsBatchForm";
import ProductBatchCard from "./ProductBatchCard";

const ProductsAddForm = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const tForm = useTranslations("Form");
    const tNotification = useTranslations("Notification");
    const tButton = useTranslations("Button");
    const t = useTranslations("Products.Add");
    const {
      form,
      productTypes,
      productCategories,
      productCurrencies,
      outlets,
      filterCategory,
      variantsArray,
      currency,
      altCurrencyFormat,
      mutationProduct,
      setTotalMutation,
      progress,
      setProgress,
      setMutationStatus,
      isError,
      setIsError,
      rollbackMutation,
      currencyQuery,
    } = useProductsForm();
    const [opened, { open, close }] = useDisclosure(false);
    const [varId, setVarId] = useState<number>();
    const [batchOpened, { open: batchOpen, close: batchClose }] =
      useDisclosure(false);

    const handleBatchOpen = (variant: number) => {
      setVarId(variant);
      batchOpen();
    };

    const [progressOpened, { open: progressOpen, close: progressClose }] =
      useDisclosure(false);
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
    const { userData } = useUserContext();
    const locale = useLocale();

    return (
      <Box {...props}>
        <form
          noValidate
          id="product-form"
          onSubmit={form.handleSubmit((data) => {
            // Calculate total mutation
            let mutation = 1;
            data.variants.map((variant) => {
              if (variant.images.length > 0) {
                mutation++;
              }
              variant.batches.map((batch) => {
                mutation++;
              });
              mutation++;
            });

            setTotalMutation(mutation);

            mutationProduct.mutate({
              class: "Product",
              payload: {
                payload: cleanData({
                  name: data.name,
                  details: data.details ? data.details : undefined,
                  type: data.type,
                  product_category_id: data.product_category_id
                    ? data.product_category_id
                    : undefined,
                  company_id: userData?.company.id,
                }),
              },
            });

            progressOpen();
          })}
          className="flex flex-col gap-6"
        >
          <Controller
            name="type"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <ProductsFormField
                required
                label={t("label_type")}
                field={
                  <Select
                    size="lg"
                    className="w-full sm:w-[250px]"
                    error={form.formState.errors.type?.message}
                    data={productTypes}
                    value={value}
                    onChange={(val) => {
                      onChange(val);
                      if (val) {
                        filterCategory(val);
                      }
                    }}
                    required
                    allowDeselect={false}
                  />
                }
              />
            )}
          />
          <Controller
            name="name"
            control={form.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <ProductsFormField
                required
                label={t("label_name")}
                description={t.rich("description_name", {
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
                field={
                  <TextInput
                    size="lg"
                    className="w-full"
                    error={form.formState.errors.name?.message}
                    autoComplete="off"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    maxLength={255}
                    required
                    rightSection={
                      <div>{form.getValues("name").length}/255</div>
                    }
                    rightSectionWidth={68}
                  />
                }
              />
            )}
          />
          <Controller
            name="details"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <ProductsFormField
                label={t("label_details")}
                description={t("description_details")}
                field={
                  <Textarea
                    error={form.formState.errors.details?.message}
                    autoComplete="off"
                    value={value}
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
            name="product_category_id"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <ProductsFormField
                label={t("label_category")}
                field={
                  <Select
                    className="w-full sm:w-[250px]"
                    error={form.formState.errors.product_category_id?.message}
                    leftSection={
                      userData?.privileges.includes(
                        "DATA_CREATE_PRODUCT_CATEGORY"
                      ) ? (
                        <Tooltip openDelay={500} label={t("tooltip_category")}>
                          <ActionIcon
                            size="sm"
                            variant="transparent"
                            type="button"
                            aria-label="add category button"
                            onClick={open}
                          >
                            <IconPlus stroke={3} />
                          </ActionIcon>
                        </Tooltip>
                      ) : undefined
                    }
                    searchable
                    nothingFoundMessage={t("nothing_category")}
                    data={productCategories}
                    value={value}
                    onChange={onChange}
                  />
                }
              />
            )}
          />
          <Divider className="my-4 sm:my-6" />
          {variantsArray.fields.map((field, id) => (
            <Box key={id} className="flex flex-col gap-6">
              {variantsArray.fields.length > 1 ? (
                <>
                  <div className="flex items-center gap-4">
                    <Text
                      variant="gradient"
                      className="m-0 uppercase font-bold"
                    >
                      {t("subtitle_variant", { no: id + 1 })}
                    </Text>
                    {id !== 0 ? (
                      <Button
                        variant="light"
                        color="red"
                        size="xs"
                        radius="xl"
                        leftSection={<IconCircleMinus size="16" stroke="4" />}
                        aria-label="remove variant"
                        onClick={() => {
                          variantsArray.remove(id);
                          if (variantsArray.fields.length === 2) {
                            form.setValue(`variants.0.label`, "");
                            form.setValue(`variants.0.specifications`, "");
                          }
                        }}
                      >
                        {t("btn_remove")}
                      </Button>
                    ) : (
                      <></>
                    )}
                  </div>

                  <Controller
                    name={`variants.${id}.label`}
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <ProductsFormField
                        label={t("label_label")}
                        description={t("description_label")}
                        required
                        field={
                          <TextInput
                            className="w-full xs:w-[250px]"
                            error={
                              form.formState.errors.variants?.[id]?.label
                                ?.message
                            }
                            disabled={variantsArray.fields.length === 1}
                            autoComplete="off"
                            value={value}
                            onChange={onChange}
                            maxLength={50}
                            required
                            rightSection={
                              <div className="text-sm">
                                {form.getValues(`variants.${id}.label`).length}
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
                    name={`variants.${id}.specifications`}
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <ProductsFormField
                        label={t("label_specifications")}
                        description={t("description_specifications")}
                        field={
                          <Textarea
                            error={
                              form.formState.errors.variants?.[id]
                                ?.specifications?.message
                            }
                            autoComplete="off"
                            value={value}
                            onChange={onChange}
                            autosize
                            minRows={4}
                            className="w-full"
                          />
                        }
                      />
                    )}
                  />
                </>
              ) : (
                <></>
              )}
              <Controller
                name={`variants.${id}.images`}
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <ProductsFormField
                    label={t("label_images")}
                    description={t("description_images")}
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
                                        {t("validation_image_size", {
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
                            const currentImages = form.getValues(
                              `variants.${id}.images`
                            );
                            if (currentImages) {
                              if (currentImages.length + f.length > 6) {
                                showNotification(
                                  "yellow",
                                  tNotification("title_error"),
                                  tForm("validation_max_image", { count: 6 })
                                );
                              } else {
                                form.setValue(`variants.${id}.images`, [
                                  ...currentImages,
                                  ...f,
                                ]);
                              }
                            } else {
                              form.setValue(`variants.${id}.images`, f);
                            }
                          }}
                          className="h-24"
                          maxFiles={6}
                          maxSize={3145728}
                        >
                          <Text className="opacity-60 font-light italic">
                            {t("body_dropzone")}
                          </Text>
                        </Dropzone>
                        <div className="w-full mt-2 flex gap-4 flex-wrap">
                          {form
                            .watch(`variants.${id}.images`)
                            ?.map((file, index) => {
                              const imageUrl = URL.createObjectURL(file);
                              return (
                                <ProductsImageThumbnail
                                  image={imageUrl}
                                  removeFn={() => {
                                    const currentImages = form.getValues(
                                      `variants.${id}.images`
                                    );
                                    if (currentImages) {
                                      currentImages.splice(index, 1);
                                    }

                                    form.setValue(
                                      `variants.${id}.images`,
                                      currentImages
                                    );
                                  }}
                                  key={index}
                                  className="w-24 h-24 opacity-60 hover:opacity-100 transition-opacity cursor-pointer relative"
                                />
                              );
                            })}
                        </div>
                      </div>
                    }
                  />
                )}
              />

              <ProductsFormField
                label={t("field_batch")}
                required
                description={t.rich("description_batch", {
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
                field={
                  <div className="flex flex-col mb-4 w-full">
                    <div className="flex gap-4 self-start items-center">
                      <Button
                        variant="light"
                        leftSection={<IconPackage />}
                        onClick={() => {
                          handleBatchOpen(id);
                        }}
                        type="button"
                        color={
                          form.formState.errors.variants?.[id]?.batches?.message
                            ? "red"
                            : undefined
                        }
                      >
                        {t("btn_add_batch")}
                      </Button>
                      <Text className="opacity-70">
                        Total: {form.getValues(`variants.${id}.batches`).length}
                      </Text>
                    </div>
                    <Carousel
                      slideSize={400}
                      slideGap="lg"
                      align="start"
                      slidesToScroll={1}
                      containScroll="trimSnaps"
                      withControls={false}
                      dragFree
                      classNames={{
                        viewport: "mt-6",
                      }}
                    >
                      {form
                        .getValues(`variants.${id}.batches`)
                        .map((batch, batchId) => (
                          <Carousel.Slide key={batchId}>
                            <ProductBatchCard
                              className="p-4 rounded-lg bg-slate-300/70 dark:bg-slate-800 h-[160px] relative select-none"
                              batch={batch}
                              batchId={batchId}
                              outlets={outlets}
                              productForm={form}
                              varId={id}
                              currency={currency}
                              productCurrencies={productCurrencies}
                              currencyQuery={currencyQuery}
                              altCurrencyFormat={altCurrencyFormat}
                            />
                          </Carousel.Slide>
                        ))}
                    </Carousel>
                  </div>
                }
              />
            </Box>
          ))}

          <div className="flex justify-end flex-col xs:flex-row gap-4 mt-6 mb-4">
            <Button
              variant="light"
              leftSection={<IconPlus />}
              type="button"
              size="lg"
              onClick={() => {
                variantsArray.append({
                  id: "",
                  label: "",
                  specifications: "",
                  images: [],
                  batches: [],
                });
              }}
            >
              {t("btn_add_variant")}
            </Button>
            <Button
              variant="gradient"
              leftSection={<IconDeviceFloppy />}
              type="submit"
              size="lg"
            >
              {tButton("save")}
            </Button>
          </div>
        </form>

        <Modal opened={opened} onClose={close} title={t("tooltip_category")}>
          <ProductsCategoryForm onFinish={close} />
        </Modal>

        <Modal
          opened={batchOpened}
          onClose={batchClose}
          title={t("title_batch_form")}
        >
          <ProductsBatchForm
            productForm={form}
            varId={varId ? varId : 0}
            currency={currency}
            productCurrencies={productCurrencies}
            currencyQuery={currencyQuery}
            altCurrencyFormat={altCurrencyFormat}
            locale={locale}
            outlets={outlets}
            onClose={() => {
              setVarId(undefined);
              batchClose();
            }}
          />
        </Modal>

        <ProgressDialog
          value={Math.round(progress * 100)}
          isError={isError}
          opened={progressOpened}
          onClose={progressClose}
          body={
            <div>
              {Math.round(progress * 100) < 100 ? (
                <h3>💾 {t("progress_loading_body")}</h3>
              ) : (
                <h3>✅ {t("progress_complete_body")}</h3>
              )}
            </div>
          }
          closeBtnText={tButton("close")}
          closeFn={() => {
            if (isError) {
              rollbackMutation();
              progressClose();
            } else {
              form.reset();
              progressClose();
              setTimeout(() => {
                setProgress(0);
                setMutationStatus([]);
                setIsError(false);
              }, 500);
            }
          }}
        />
      </Box>
    );
  }
);

ProductsAddForm.displayName = "ProductsAddForm";
export default ProductsAddForm;
