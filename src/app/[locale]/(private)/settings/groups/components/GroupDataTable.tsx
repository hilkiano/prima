"use client";

import {
  ActionIcon,
  Box,
  BoxProps,
  Menu,
  Modal,
  ThemeIcon,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import useGroups from "../hooks/groups.hooks";
import DataTable from "@/components/DataTable";
import { createColumnHelper, VisibilityState } from "@tanstack/react-table";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { useLocale, useTranslations } from "next-intl";
import {
  IconDotsVertical,
  IconEye,
  IconKey,
  IconPencil,
  IconRestore,
  IconTrash,
} from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import GroupDataTableAdditionalFilter from "./GroupDataTableAdditionalFilter";
import { DataTableState } from "@/types/common.types";
import { TGroupFormState } from "@/types/page.types";
import useGroupsForm from "../hooks/groups.form.hooks";
import GroupForm from "./GroupForm";
import { useQueryClient } from "@tanstack/react-query";

const GroupDataTable = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const locale = useLocale();
    const tTable = useTranslations("DataTable");
    const t = useTranslations("Groups");
    const [opened, { open, close }] = useDisclosure(false);
    const [formOpened, { open: formOpen, close: formClose }] =
      useDisclosure(false);
    const tableState: DataTableState = useGroups();
    const formState: TGroupFormState = useGroupsForm({
      closeCallback: () => {
        setData(null);
        formClose();
      },
    });
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
    const queryClient = useQueryClient();
    const [data, setData] = React.useState<Group | null>(null);

    const columnHelper = createColumnHelper<Group & { action: any }>();

    const updateGroup = (data: Group) => {
      formState.form.setValue("id", data.id);
      formState.form.setValue("name", data.name);
      formState.form.setValue("description", data.description ?? "");
      formState.form.setValue("privileges", data.privileges);
      formState.query.refetch();
      setData(data);
      formOpen();
    };

    const columns = React.useMemo(
      () => [
        columnHelper.accessor("id", {
          id: "id",
          cell: (info) => (
            <p className="truncate m-0 font-mono">{info.getValue()}</p>
          ),
          header: () => <span>{t("Columns.id")}</span>,
          size: 200,
          enableSorting: false,
          enableGlobalFilter: true,
          enableHiding: true,
        }),
        columnHelper.accessor("name", {
          id: "name",
          cell: (info) => <p className="truncate m-0">{info.getValue()}</p>,
          header: () => <span>{t("Columns.name")}</span>,
          size: 200,
          enableSorting: true,
          enableGlobalFilter: true,
          enableHiding: false,
        }),
        columnHelper.accessor("description", {
          id: "description",
          cell: (info) =>
            info.getValue() ? (
              <span className="line-clamp-3">{info.getValue()}</span>
            ) : (
              "-"
            ),
          header: () => <span>{t("Columns.description")}</span>,
          size: 350,
          enableSorting: true,
          enableGlobalFilter: true,
          enableHiding: true,
        }),
        columnHelper.accessor("privileges", {
          id: "privileges",
          cell: (info) => {
            const countPrivileges = info.getValue().length;
            return (
              <div className="flex gap-2 items-center">
                <ThemeIcon radius="xl" size="sm">
                  <IconKey size={12} className="opacity-60" />
                </ThemeIcon>
                {new Intl.NumberFormat(locale).format(countPrivileges)}
              </div>
            );
          },
          header: () => <span>{t("Columns.privileges")}</span>,
          size: 100,
          enableSorting: false,
          enableGlobalFilter: false,
          enableHiding: false,
        }),
        columnHelper.accessor("created_at", {
          id: "created_at",
          cell: (info) =>
            dayjs(info.getValue()).locale(locale).format("YYYY-MM-DD HH:mm:ss"),
          header: () => <span>{t("Columns.created_at")}</span>,
          size: 200,
          enableSorting: true,
          enableGlobalFilter: false,
          enableHiding: true,
        }),
        columnHelper.accessor("updated_at", {
          id: "updated_at",
          cell: (info) =>
            dayjs(info.getValue()).locale(locale).format("YYYY-MM-DD HH:mm:ss"),
          header: () => <span>{t("Columns.updated_at")}</span>,
          size: 200,
          enableSorting: true,
          enableGlobalFilter: false,
          enableHiding: true,
        }),
        columnHelper.accessor("action", {
          id: "action",
          cell: (info) => {
            return (
              <div className="flex justify-center">
                <Menu keepMounted shadow="md" width={160}>
                  <Menu.Target>
                    <Tooltip openDelay={500} label={tTable("menu_tooltip")}>
                      <ActionIcon
                        variant="filled"
                        radius="xl"
                        aria-label="action"
                      >
                        <IconDotsVertical size={14} />
                      </ActionIcon>
                    </Tooltip>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item disabled leftSection={<IconEye size={20} />}>
                      {tTable("menu_view")}
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => updateGroup(info.row.original)}
                      disabled={!!info.row.original.deleted_at}
                      leftSection={<IconPencil size={20} />}
                    >
                      {tTable("menu_update")}
                    </Menu.Item>
                    {!info.row.original.deleted_at ? (
                      <Menu.Item leftSection={<IconTrash size={20} />}>
                        {tTable("menu_delete")}
                      </Menu.Item>
                    ) : (
                      <Menu.Item leftSection={<IconRestore size={20} />}>
                        {tTable("menu_restore")}
                      </Menu.Item>
                    )}
                  </Menu.Dropdown>
                </Menu>
              </div>
            );
          },
          header: () => <span>&nbsp;</span>,
          size: 50,
          enableSorting: false,
          enableGlobalFilter: false,
          enableHiding: false,
        }),
      ],
      [columnHelper, locale, t]
    );

    const defaultVisibility: VisibilityState = {};

    React.useEffect(() => {
      const globalFilteredColumns = columns.filter(
        (column) => column.enableGlobalFilter
      );
      tableState.setGlobalFilterColumns(
        globalFilteredColumns.map((column) => column.id).join(",")
      );
    }, [columns, tableState]);

    return (
      <Box {...props}>
        <DataTable
          tableState={tableState}
          columns={columns}
          visibilityState={defaultVisibility}
          additionalFilterComponent={
            <GroupDataTableAdditionalFilter
              centered
              tableState={tableState}
              opened={opened}
              open={open}
              close={close}
            />
          }
          openAdditionalFilter={open}
          minWidth={1300}
        />
        <Modal
          opened={formOpened}
          onClose={() => {
            formClose();
            formState.form.reset();
            queryClient.invalidateQueries({ queryKey: ["privilegeList"] });
          }}
          title={t("Form.title_update", {
            name: data ? data.name : "",
          })}
          size="lg"
          fullScreen={isMobile}
        >
          <GroupForm formState={formState} />
        </Modal>
      </Box>
    );
  }
);

GroupDataTable.displayName = "GroupDataTable";

export default GroupDataTable;
