"use client";

import {
  ActionIcon,
  Box,
  BoxProps,
  Button,
  Divider,
  InputBase,
  Modal,
  Select,
  Textarea,
  TextInput,
  Tooltip,
  Text,
  useMantineTheme,
  List,
} from "@mantine/core";
import { useLocale, useTranslations } from "next-intl";
import React from "react";
import useProductsForm from "../_hooks/products_form.hooks";
import { Controller } from "react-hook-form";
import ProductsFormField from "./ProductsFormField";
import {
  IconCalendarDue,
  IconCircleMinus,
  IconDeviceFloppy,
  IconPlus,
} from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import ProductsCategoryForm from "./ProductsCategoryForm";
import { useUserContext } from "@/lib/userProvider";
import { InputNumberFormat } from "@react-input/number-format";
import { DateInput, DatesProvider } from "@mantine/dates";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

import "dayjs/locale/id";
import { showNotification } from "@/lib/errorHandler";
import { cleanData, formatFileSize } from "@/lib/helpers";
import ProductsImageThumbnail from "./ProductsImageThumbnail";
import ProgressDialog from "@/components/dialogs/ProgressDialog";

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
      filterCategory,
      variantsArray,
      currency,
      setCurrency,
      altCurrencyFormat,
      mutationProduct,
      setTotalMutation,
      progress,
      setProgress,
    } = useProductsForm();
    const [opened, { open, close }] = useDisclosure(false);
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
              mutation = mutation + 2;
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
                  outlet_id: userData?.outlet.id,
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
                name={`variants.${id}.stock`}
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <ProductsFormField
                    label={t("label_stock")}
                    required
                    field={
                      <InputBase
                        className="w-full sm:w-[150px]"
                        error={
                          form.formState.errors.variants?.[id]?.stock?.message
                        }
                        autoComplete="off"
                        value={value}
                        onChange={onChange}
                        maxLength={50}
                        component={InputNumberFormat}
                        locales={locale}
                        variant="filled"
                      />
                    }
                  />
                )}
              />
              <ProductsFormField
                label={t("label_price")}
                required
                field={
                  <div className="flex flex-col lg:flex-row gap-4">
                    <Select
                      label="Currency"
                      className="w-full sm:w-[100px]"
                      data={productCurrencies}
                      value={currency}
                      onChange={(val) => {
                        val ? setCurrency(val) : undefined;
                        form.setValue(`variants.${id}.base_capital_price`, "");
                        form.setValue(`variants.${id}.base_selling_price`, "");
                      }}
                      allowDeselect={false}
                    />
                    <Controller
                      name={`variants.${id}.base_capital_price`}
                      control={form.control}
                      render={({ field: { onChange, value } }) => (
                        <InputBase
                          label={t("label_capital_price")}
                          className="w-full sm:w-[200px]"
                          error={
                            form.formState.errors.variants?.[id]
                              ?.base_capital_price?.message
                          }
                          autoComplete="off"
                          value={value}
                          onChange={onChange}
                          component={InputNumberFormat}
                          locales={locale}
                          variant="filled"
                          format="currency"
                          currency={currency}
                          currencyDisplay={
                            altCurrencyFormat ? "symbol" : "code"
                          }
                          maximumFractionDigits={0}
                        />
                      )}
                    />
                    <Controller
                      name={`variants.${id}.base_selling_price`}
                      control={form.control}
                      render={({ field: { onChange, value } }) => (
                        <InputBase
                          label={t("label_selling_price")}
                          className="w-full sm:w-[200px]"
                          error={
                            form.formState.errors.variants?.[id]
                              ?.base_selling_price?.message
                          }
                          autoComplete="off"
                          value={value}
                          onChange={onChange}
                          component={InputNumberFormat}
                          locales={locale}
                          variant="filled"
                          format="currency"
                          currency={currency}
                          currencyDisplay={
                            altCurrencyFormat ? "symbol" : "code"
                          }
                          maximumFractionDigits={0}
                        />
                      )}
                    />
                  </div>
                }
              />
              <Controller
                name={`variants.${id}.expired_at`}
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <ProductsFormField
                    label={t("label_expired_at")}
                    field={
                      <DatesProvider settings={{ locale: locale }}>
                        <DateInput
                          leftSection={<IconCalendarDue />}
                          clearable
                          minDate={new Date()}
                          variant="filled"
                          value={value}
                          onChange={onChange}
                          valueFormat="DD MMMM YYYY"
                        />
                      </DatesProvider>
                    }
                  />
                )}
              />
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
                            .getValues(`variants.${id}.images`)
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
                  base_capital_price: "",
                  base_selling_price: "",
                  stock: "",
                  expired_at: undefined,
                  images: [],
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
            <Button size="lg" onClick={progressOpen}>
              Progress
            </Button>
          </div>
        </form>

        <Modal opened={opened} onClose={close} title={t("tooltip_category")}>
          <ProductsCategoryForm onFinish={close} />
        </Modal>

        <ProgressDialog
          value={Math.round(progress * 100)}
          opened={progressOpened}
          onClose={progressClose}
          body={
            <div>
              {Math.round(progress * 100) < 100 ? (
                <h3>Saving...</h3>
              ) : (
                <h3>Saving completed.</h3>
              )}
            </div>
          }
          closeBtnText={tButton("close")}
          closeFn={() => {
            progressClose();
            setTimeout(() => {
              setProgress(0);
            }, 500);
          }}
        />
      </Box>
    );
  }
);

ProductsAddForm.displayName = "ProductsAddForm";
export default ProductsAddForm;
