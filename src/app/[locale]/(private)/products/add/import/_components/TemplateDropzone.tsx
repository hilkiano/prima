import { importTemplate } from "@/services/upload.service";
import { Box, BoxProps, Loader, ScrollArea, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconFileUpload } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { forwardRef, useEffect, useState } from "react";
import echo from "@/vars/echo";
import { ImportEventProgress } from "@/types/common.types";
import ProgressDialog from "@/components/dialogs/ProgressDialog";
import { useDisclosure } from "@mantine/hooks";

const TemplateDropzone = forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const locale = useLocale();
    const tButton = useTranslations("Button");
    const t = useTranslations("Products.Import");
    const [fileName, setFileName] = useState<string>();
    const [importProgress, setImportProgress] = useState<ImportEventProgress>();
    const [opened, { open, close }] = useDisclosure();
    const mutation = useMutation({
      mutationFn: importTemplate,
      onMutate: () => {
        echo
          .channel(`progress_${fileName}`)
          .listen(".ImportProgress", (event: ImportEventProgress) => {
            console.log(event);
            setImportProgress(event);
          });
      },
    });

    const DuplicateDetails = ({
      data,
    }: {
      data:
        | { [key: string]: number[] }[]
        | { errors: string[]; product_name: string }[];
    }) => {
      const duplicationData = data as { [key: string]: number[] }[];
      const strings: any = [];
      for (const entry of Object.entries(duplicationData)) {
        strings.push(
          t.rich("import_duplicate_detail", {
            name: entry[0],
            row: entry[1].toString(),
          })
        );
      }

      return strings.map((val: string, index: number) => (
        <Text className="font-mono text-sm" key={index}>
          {val}
        </Text>
      ));
    };

    const CountDetails = ({
      data,
    }: {
      data:
        | { [key: string]: number[] }[]
        | { errors: string[]; product_name: string }[];
    }) => {
      const countData = data as { [key: string]: number[] }[];
      const strings: any[] = [];
      for (const entry of Object.entries(countData)) {
        strings.push(
          `${t(entry[0])}: ${Intl.NumberFormat(locale).format(
            Number(entry[1])
          )}`
        );
      }

      return (
        <ul className="m-0 pl-8">
          {strings.map((val: string, index: number) => (
            <li key={index}>
              <Text className="font-mono text-sm">{val}</Text>
            </li>
          ))}
        </ul>
      );
    };

    const ValidationDetails = ({
      data,
    }: {
      data:
        | { [key: string]: number[] }[]
        | { errors: string[]; product_name: string }[];
    }) => {
      const validationData = data as {
        errors: string[];
        product_name: string;
      }[];

      return validationData.map((row, i) => (
        <div className="flex flex-col" key={i}>
          <Text className="font-mono text-sm text-red-400">
            {row.product_name}
          </Text>
          {row.errors.map((error, j) => (
            <Text key={j} className="font-mono text-xs">
              👉{" "}
              {error.split("|")[0].includes("variant") ||
              error.split("|")[0].includes("batch")
                ? t.rich(`Errors.${error.split("|")[0]}`, {
                    attribute: t(
                      `Validation.${error.split("|")[1]}`
                    ).toLowerCase(),
                    position: error.split("|")[2],
                    value:
                      error.split("|").length === 4
                        ? error.split("|")[3]
                        : null,
                  })
                : t.rich(`Errors.${error.split("|")[0]}`, {
                    attribute: t(
                      `Validation.${error.split("|")[1]}`
                    ).toLowerCase(),
                    value: error.split("|")[2],
                  })}
            </Text>
          ))}
        </div>
      ));
    };

    const ProgressBody = () => {
      return (
        <Box className="w-full">
          {importProgress ? (
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                {importProgress.is_done ? (
                  "✅"
                ) : importProgress.is_error ? (
                  "⛔"
                ) : (
                  <Loader size="sm" color="blue" type="dots" />
                )}
                <h3>{t(importProgress.message)}</h3>
              </div>
              {importProgress.details ? (
                <ScrollArea
                  className="rounded-lg bg-slate-300 dark:bg-slate-700/50 mb-4"
                  h={150}
                >
                  <Box className="p-2 sm:p-4">
                    <div className="flex flex-col gap-2">
                      <Text className="font-mono">
                        {importProgress.details.message.split("|").length > 1
                          ? t.rich(
                              importProgress.details.message.split("|")[0],
                              {
                                processed:
                                  importProgress.details.message.split("|")[1],
                                total:
                                  importProgress.details.message.split("|")[2],
                              }
                            )
                          : t(importProgress.details.message)}
                      </Text>
                      {importProgress.details.data ? (
                        importProgress.details.message ===
                        "import_duplicate_name" ? (
                          <DuplicateDetails
                            data={importProgress.details.data}
                          />
                        ) : importProgress.details.message ===
                          "import_max_rows" ? (
                          <CountDetails data={importProgress.details.data} />
                        ) : importProgress.details.message ===
                          "import_validation_errors" ? (
                          <ValidationDetails
                            data={importProgress.details.data}
                          />
                        ) : (
                          <></>
                        )
                      ) : (
                        <></>
                      )}
                    </div>
                  </Box>
                </ScrollArea>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Loader size="sm" color="blue" type="dots" />
              <h3>{t("progress_wait")}</h3>
            </div>
          )}
        </Box>
      );
    };

    useEffect(() => {
      if (importProgress?.is_done || importProgress?.is_error) {
        echo.leaveChannel(`progress_${fileName}`);
      }
    }, [importProgress, fileName]);

    return (
      <Box {...props}>
        <Dropzone
          onDrop={(files) => {
            const formData = new FormData();
            formData.append("model", "Product");
            formData.append("file", files[0]);
            formData.append(
              "tz",
              Intl.DateTimeFormat().resolvedOptions().timeZone
            );

            setFileName(files[0].name);
            setImportProgress(undefined);

            setTimeout(() => {
              mutation.mutate(formData);
              open();
            }, 250);
          }}
          className="h-32 mt-6"
          accept={[
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ]}
          multiple={false}
        >
          <div className="flex flex-col items-center gap-4">
            <IconFileUpload className="opacity-60" stroke={2} size={48} />
            <Text className="opacity-60 font-light italic">
              {t("dropzone_body")}
            </Text>
          </div>
        </Dropzone>
        <ProgressDialog
          closable={
            importProgress
              ? importProgress.is_done || importProgress.is_error
              : false
          }
          size="lg"
          opened={opened}
          onClose={close}
          closeBtnText={tButton("close")}
          value={importProgress ? importProgress.progress : 0}
          isError={importProgress ? importProgress.is_error : false}
          body={<ProgressBody />}
          closeFn={() => {
            close();
          }}
        />
      </Box>
    );
  }
);

TemplateDropzone.displayName = "TemplateDropzone";
export default TemplateDropzone;
