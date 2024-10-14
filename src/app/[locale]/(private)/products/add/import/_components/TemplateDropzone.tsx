import { importTemplate } from "@/services/upload.service";
import { Box, BoxProps, Button, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconFileUpload } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import React, { forwardRef, useState } from "react";
import echo from "@/vars/echo";
import { ImportEventProgress } from "@/types/common.types";
import ProgressDialog from "@/components/dialogs/ProgressDialog";
import { useDisclosure } from "@mantine/hooks";

const TemplateDropzone = forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
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
          accept={["text/csv"]}
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
          size="lg"
          opened={opened}
          onClose={close}
          closeBtnText={tButton("close")}
          value={importProgress ? importProgress.progress : 0}
          error={importProgress ? importProgress.is_error : false}
          errorBody={
            <div>
              <h3>{importProgress ? t(importProgress.message) : ""}</h3>
            </div>
          }
          body={
            importProgress ? (
              <div>
                <h3>{t(importProgress.message)}</h3>
              </div>
            ) : (
              <div>
                <h3>{t("progress_wait")}</h3>
              </div>
            )
          }
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
