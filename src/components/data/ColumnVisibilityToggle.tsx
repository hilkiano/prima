import { Button, ButtonProps, Checkbox, Menu } from "@mantine/core";
import { IconCaretDownFilled } from "@tabler/icons-react";
import { Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import React, { forwardRef } from "react";

type TColumnVisibilityToggle = {
  table: Table<any>;
  model: string;
};

const ColumnVisibilityToggle = forwardRef<
  HTMLDivElement,
  ButtonProps & TColumnVisibilityToggle
>(({ table, model, ...props }, ref) => {
  const t = useTranslations("Data");

  return (
    <Menu keepMounted shadow="md" width={200}>
      <Menu.Target>
        <Button
          variant="outline"
          rightSection={<IconCaretDownFilled size={14} />}
          className="w-full xs:w-auto"
          {...props}
        >
          {t("Table.column_visibility_toggle")}
        </Button>
      </Menu.Target>

      <Menu.Dropdown className="p-4">
        <div className="flex flex-col gap-2">
          <Checkbox
            checked={table.getIsAllColumnsVisible()}
            onChange={table.getToggleAllColumnsVisibilityHandler()}
            label={t("Table.toggle_all")}
          />
          <Menu.Divider />
          {table
            .getAllLeafColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <Checkbox
                  key={column.id}
                  className="mb-2"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                  label={t(`Table.Columns.${model}.${column.id}`)}
                />
              );
            })}
        </div>
      </Menu.Dropdown>
    </Menu>
  );
});

ColumnVisibilityToggle.displayName = "ColumnVisibilityToggle";
export default ColumnVisibilityToggle;
