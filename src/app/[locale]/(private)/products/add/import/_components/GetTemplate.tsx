"use client";

import {
  Text,
  Box,
  BoxProps,
  ActionIcon,
  Tooltip,
  Modal,
  Table,
  TableData,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import React from "react";
import { IconHelpCircleFilled } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "@/lib/navigation";
import TemplateDropzone from "./TemplateDropzone";

const GetTemplate = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const t = useTranslations("Products.Import");
    const [opened, { open, close }] = useDisclosure(false);

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
          t("Validation.field_type"),
          t("Validation.description_type"),
          "PHYSICAL",
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
          t("Validation.field_expired_at"),
          t("Validation.description_expired_at"),
          "2024-12-20 14:10:57",
        ],
      ],
    };

    return (
      <Box {...props}>
        <Text variant="gradient" className="text-lg sm:text-xl font-black">
          {t("template_header")}
        </Text>
        {t.rich("template_body", {
          link: (chunks) => (
            <a href="/api/download/template?model=Product&type=import&format=csv">
              {chunks}
            </a>
          ),
        })}
        <div className="p-4 mt-4 rounded-md bg-slate-300/50 dark:bg-slate-800/70">
          <div className="flex items-center gap-2">
            <Text variant="gradient" className="text-lg sm:text-xl font-black ">
              {t("rules_header")}
            </Text>
            <Tooltip label={t("rules_tooltip")}>
              <ActionIcon
                size="sm"
                variant="transparent"
                type="button"
                aria-label="show column rules"
                onClick={open}
              >
                <IconHelpCircleFilled />
              </ActionIcon>
            </Tooltip>
          </div>

          <ul>
            <li>
              {t.rich("rules_1", {
                emp: (chunks) => (
                  <span className="font-black text-red-500 dark:text-red-600 italic">
                    {chunks}
                  </span>
                ),
              })}
            </li>
            <li>
              {t.rich("rules_2", {
                emp: (chunks) => (
                  <span className="font-black text-red-500 dark:text-red-600 italic">
                    {chunks}
                  </span>
                ),
              })}
            </li>
            <li>{t("rules_3")}</li>
            <li>
              {t.rich("rules_4", {
                link: (chunks) => <Link href="/products/add">{chunks}</Link>,
              })}
            </li>
          </ul>
        </div>
        <TemplateDropzone />

        <Modal
          opened={opened}
          onClose={close}
          title={t("Validation.modal_title")}
          size="xl"
          classNames={{
            content: "pb-6",
          }}
        >
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
