"use client";

import { usePathname, useRouter } from "@/lib/navigation";
import { Select, SelectProps, Tooltip } from "@mantine/core";
import { useTranslations } from "next-intl";
import React, { useTransition } from "react";

type TLocaleToggle = {
  locale: string;
};

const LocaleToggle = React.forwardRef<
  HTMLDivElement,
  TLocaleToggle & SelectProps
>(({ locale, ...props }, ref) => {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Language");
  function onSelectChange(value: string) {
    startTransition(() => {
      router.replace(pathname, { locale: value });
    });
  }

  const languageOptions = [
    {
      label: t("id"),
      value: "id",
    },
    {
      label: t("en"),
      value: "en",
    },
  ];

  return (
    <>
      <Tooltip withArrow position="left" label={t("desc")}>
        <Select
          aria-label={t("desc")}
          classNames={{
            input: "rounded-full font-semibold",
            dropdown: "rounded-lg !w-auto",
          }}
          data={languageOptions}
          value={locale}
          disabled={isPending}
          variant="filled"
          size="xs"
          onChange={(val) => {
            if (locale !== val) {
              onSelectChange(val!);
            }
          }}
          allowDeselect={false}
          rightSection={<i className="ti ti-world text-lg"></i>}
          {...props}
        />
      </Tooltip>
    </>
  );
});

LocaleToggle.displayName = "LocaleToggle";

export default LocaleToggle;
