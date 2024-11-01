import { useTranslations } from "next-intl";
import { FormHTMLAttributes, forwardRef } from "react";
import useProductUpdate from "../_hooks/product_update.hooks";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import ProductsFormField from "../../../add/_components/ProductsFormField";
import { Text, Button, List, Textarea, TextInput, Modal } from "@mantine/core";
import { IconDeviceFloppy, IconPackage } from "@tabler/icons-react";
import { showNotification } from "@/lib/errorHandler";
import { formatFileSize } from "@/lib/helpers";
import ProductsImageThumbnail from "../../../add/_components/ProductsImageThumbnail";
import { Carousel } from "@mantine/carousel";
import ProductBatchCard from "../../../add/_components/ProductBatchCard";
import ProductsBatchForm from "../../../add/_components/ProductsBatchForm";
import { useDisclosure } from "@mantine/hooks";

type TProductVariantForm = {
  data: ProductVariant;
  number: number;
  singleVariant: boolean;
};

const ProductVariantForm = forwardRef<
  HTMLFormElement,
  FormHTMLAttributes<HTMLFormElement> & TProductVariantForm
>(({ data, number, singleVariant, ...props }, ref) => {
  const tNotification = useTranslations("Notification");
  const tForm = useTranslations("Form");
  const tButton = useTranslations("Button");
  const t = useTranslations("Products");

  const schema = z.object({
    id: z.string(),
    label: z.string().max(50, tForm("validation_max_char", { max: 50 })),
    specifications: z.string(),
    images: z.custom<FileWithPath[]>(),
    batches: z
      .array(
        z
          .object({
            id: z.string(),
            outlet_id: z.string(),
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
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: data.id,
      label: data.label,
      specifications: data.specifications,
      images: [],
      batches:
        data.batches?.map((batch) => {
          return {
            id: batch.id,
            outlet_id: batch.outlet_id,
            stock: batch.stock.toString(),
            is_infinite_stock: batch.is_infinite_stock,
            currency_id: batch.currency_id,
            base_capital_price: batch.base_capital_price
              ? batch.base_capital_price.toString()
              : "",
            base_selling_price: batch.base_selling_price.toString(),
            expired_at: batch.expired_at,
          };
        }) ?? [],
    },
  });

  const [opened, { open, close }] = useDisclosure(false);

  const { mutations, combobox, currency, currencyQuery, altCurrencyFormat } =
    useProductUpdate();

  return (
    <>
      <form noValidate id="product-form" className="flex flex-col gap-6 my-6">
        {singleVariant ? (
          <></>
        ) : (
          <>
            <Text variant="gradient" className="m-0 uppercase font-bold">
              {t("Add.subtitle_variant", { no: number })}
            </Text>
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
                      value={value}
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
        )}

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
                {form.getValues("batches").map((batch, batchId) => (
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
        <Button
          variant="gradient"
          leftSection={<IconDeviceFloppy />}
          type="submit"
          size="md"
          className="mt-4 self-end"
        >
          {tButton("save")}
        </Button>
      </form>

      <Modal opened={opened} onClose={close} title={t("Add.title_batch_form")}>
        <></>
      </Modal>
    </>
  );
});

ProductVariantForm.displayName = "ProductVariantForm";
export default ProductVariantForm;
