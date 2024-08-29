"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, Modal, ModalProps } from "@mantine/core";
import { useTranslations } from "next-intl";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import useGroups from "../hooks/groups.hooks";
import { IconCheck } from "@tabler/icons-react";

type TGroupDataTableAdditionalFilter = {
  tableState: any;
  opened: boolean;
  open: () => void;
  close: () => void;
};

const GroupDataTableAdditionalFilter = React.forwardRef<
  HTMLDivElement,
  TGroupDataTableAdditionalFilter & Partial<ModalProps>
>(({ tableState, opened, open, close, ...props }, ref) => {
  const tButton = useTranslations("Button");
  const tTable = useTranslations("DataTable");
  const t = useTranslations("Groups");

  const schema = z.object({
    with_trashed: z.boolean(),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      with_trashed: tableState.withTrashed,
    },
  });

  return (
    <Modal
      {...props}
      opened={opened}
      onClose={close}
      title={tTable("additional_filter")}
    >
      <form
        noValidate
        onSubmit={form.handleSubmit((data) => {
          tableState.setWithTrashed(data.with_trashed);
          close();
        })}
        className="flex flex-col gap-4"
      >
        <Controller
          control={form.control}
          name="with_trashed"
          render={({ field: { onChange, value } }) => (
            <Checkbox
              checked={value}
              onChange={onChange}
              label={tTable("show_deleted_label")}
            />
          )}
        />
        <Button
          className="mt-6 self-end"
          leftSection={<IconCheck size={16} />}
          type="submit"
        >
          {tButton("apply_filter")}
        </Button>
      </form>
    </Modal>
  );
});

GroupDataTableAdditionalFilter.displayName = "GroupDataTableAdditionalFilter";

export default GroupDataTableAdditionalFilter;
