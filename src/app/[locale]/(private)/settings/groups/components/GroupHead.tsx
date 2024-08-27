"use client";

import { Box, Text, BoxProps, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React from "react";

const GroupHead = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const t = useTranslations("Groups");

    return (
      <Box {...props}>
        <div className="flex justify-between flex-col sm:flex-row gap-4">
          <div>
            <Text variant="gradient" className="text-4xl sm:text-5xl font-bold">
              {t("Body.header")}
            </Text>
            <Text className="text-lg opacity-75 mt-2 w-full sm:w-[450px]">
              {t("Body.body")}
            </Text>
          </div>
          <Button leftSection={<IconPlus />} variant="gradient" size="md">
            {t("Body.create_btn")}
          </Button>
        </div>
      </Box>
    );
  }
);

GroupHead.displayName = "GroupHead";

export default GroupHead;
