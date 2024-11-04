"use client";

import {
  Box,
  BoxProps,
  Modal,
  Table,
  TableData,
  Button,
  useMantineTheme,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import React from "react";
import { IconDownload, IconHelpCircle } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Link } from "@/i18n/routing";
import TemplateDropzone from "./TemplateDropzone";
import ImportGuide from "./ImportGuide";

const GetTemplate = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const t = useTranslations("Products.Import");
    const [opened, { open, close }] = useDisclosure(false);
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

    const validationTableData: TableData = {
      head: [
        t("Validation.column_1"),
        t("Validation.column_2"),
        t("Validation.column_3"),
      ],
      body: [
        [
          t("Validation.field_name"),
          t("Validation.description_name"),
          t("Validation.example_name"),
        ],
        [
          t("Validation.field_details"),
          t("Validation.description_details"),
          t("Validation.example_details"),
        ],
        [
          t("Validation.field_category"),
          t("Validation.description_category"),
          t("Validation.example_category"),
        ],
        [
          t("Validation.field_label"),
          t("Validation.description_label"),
          t("Validation.example_label"),
        ],
        [
          t("Validation.field_specifications"),
          t("Validation.description_specifications"),
          t("Validation.example_specifications"),
        ],
        [t("Validation.field_outlet"), t("Validation.description_outlet"), ""],
        [
          t("Validation.field_capital_price"),
          t("Validation.description_capital_price"),
          "15000",
        ],
        [
          t("Validation.field_selling_price"),
          t("Validation.description_selling_price"),
          "20000",
        ],
        [
          t("Validation.field_stock"),
          t("Validation.description_stock"),
          "2500",
        ],
        [
          t("Validation.field_currency"),
          t("Validation.description_currency"),
          "IDR",
        ],
        [
          t("Validation.field_expired_at"),
          t("Validation.description_expired_at"),
          "2024-12-20 14:10:57",
        ],
      ],
    };

    return (
      <Box {...props}>
        <div className="p-4 md:p-6 rounded-lg border-3 border-solid border-slate-300 dark:border-slate-700">
          <div className="flex flex-col gap-2">
            <div>
              <h1 className="text-xl md:text-3xl m-0 font-bold opacity-75">
                👉 {t("template_header")}
              </h1>
              <p className="text-lg md:text-2xl m-0 font-semibold mt-2 opacity-75">
                {t("template_body")}
              </p>
            </div>
            <div className="flex flex-col xs:flex-row gap-4 justify-end items-center mt-6">
              <Button
                size={isMobile ? "md" : "lg"}
                variant="light"
                leftSection={<IconHelpCircle />}
                fullWidth={isMobile}
                onClick={open}
              >
                {t("btn_guide")}
              </Button>
              <Button
                size={isMobile ? "md" : "lg"}
                variant="gradient"
                component="a"
                leftSection={<IconDownload />}
                href="/api/download/template?model=Product&type=import&format=xlsx"
                fullWidth={isMobile}
              >
                {t("btn_template_download")}
              </Button>
            </div>
          </div>
        </div>
        <TemplateDropzone />
        <Modal
          opened={opened}
          onClose={close}
          title={t("guide_title")}
          size="xl"
          classNames={{
            content: "pb-6",
          }}
        >
          <ImportGuide className="mb-4" />
          <Table.ScrollContainer
            minWidth={700}
            className="relative overflow-x-auto shadow-md rounded-md [&>div]:pb-0"
          >
            <Table withRowBorders data={validationTableData} />
          </Table.ScrollContainer>
        </Modal>
      </Box>
    );
  }
);

GetTemplate.displayName = "ProductsImportGetTemplate";
export default GetTemplate;
