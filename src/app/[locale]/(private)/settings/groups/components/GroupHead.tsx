"use client";

import {
  Box,
  Text,
  BoxProps,
  Button,
  useMantineTheme,
  Modal,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React from "react";
import useGroupsForm from "../hooks/groups.form.hooks";
import GroupForm from "./GroupForm";
import { useQueryClient } from "@tanstack/react-query";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { TGroupFormState } from "@/types/page.types";

const GroupHead = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const t = useTranslations("Groups");
    const [opened, { open, close }] = useDisclosure(false);
    const formState: TGroupFormState = useGroupsForm({ closeCallback: close });
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

    const queryClient = useQueryClient();

    return (
      <>
        <Box {...props}>
          <div className="flex justify-between flex-col sm:flex-row gap-4">
            <div>
              <Text
                variant="gradient"
                className="text-4xl sm:text-5xl font-bold"
              >
                {t("Body.header")}
              </Text>
              <Text className="text-lg opacity-75 mt-2 w-full sm:w-[450px]">
                {t("Body.body")}
              </Text>
            </div>
            <Button
              leftSection={<IconPlus />}
              variant="gradient"
              size="md"
              onClick={() => {
                formState.query.refetch();
                open();
              }}
            >
              {t("Body.create_btn")}
            </Button>
          </div>
        </Box>
        <Modal
          opened={opened}
          onClose={() => {
            close();
            formState.form.reset();
            queryClient.invalidateQueries({ queryKey: ["privilegeList"] });
          }}
          title={t("Form.title_add")}
          size="lg"
          fullScreen={isMobile}
        >
          <GroupForm formState={formState} />
        </Modal>
      </>
    );
  }
);

GroupHead.displayName = "GroupHead";

export default GroupHead;
