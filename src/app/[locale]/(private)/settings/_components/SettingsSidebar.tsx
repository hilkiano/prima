"use client";

import {
  Box,
  BoxProps,
  Combobox,
  Group,
  InputBase,
  UnstyledButton,
  useCombobox,
  useMantineTheme,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import React from "react";
import { Link, useRouter } from "@/lib/navigation";
import { useSearchParams } from "next/navigation";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconArrowDownCircle,
  IconCaretDown,
  IconCaretDownFilled,
} from "@tabler/icons-react";

type TCategoryItem = {
  icon: React.ReactNode;
  name: string;
  url: string;
};

const categories: TCategoryItem[] = [
  {
    icon: "🪪",
    name: "profile",
    url: "profile",
  },
  {
    icon: "🏬",
    name: "company",
    url: "company",
  },
  {
    icon: "🏪",
    name: "outlet",
    url: "outlet",
  },
];

const SettingsSidebar = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const t = useTranslations("Settings");
    const searchParams = useSearchParams();
    const submenuParam = searchParams.get("submenu");
    const theme = useMantineTheme();
    const isLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg})`);
    const combobox = useCombobox();
    const router = useRouter();

    return (
      <Box {...props}>
        <p className="text-base uppercase tracking-widest font-bold mb-4">
          {t("Sidebar.title")}
        </p>
        <div className="flex flex-col gap-2">
          {isLg ? (
            <Combobox
              store={combobox}
              withinPortal={false}
              position="bottom-start"
              onOptionSubmit={(val) => {
                router.push(`/settings?submenu=${val}`);
                combobox.closeDropdown();
              }}
            >
              <Combobox.Target>
                <InputBase
                  component="button"
                  type="button"
                  pointer
                  rightSection={<IconCaretDownFilled />}
                  onClick={() => combobox.toggleDropdown()}
                  rightSectionPointerEvents="none"
                  variant="filled"
                  classNames={{
                    root: " w-full xs:w-[300px]",
                    input: "rounded-full h-auto",
                    section: "data-[position=right]:me-2",
                  }}
                >
                  {submenuParam ? (
                    <div className="flex items-center gap-4">
                      <p className="text-[16px] m-0 pb-1">
                        {
                          categories.find((cat) => cat.name === submenuParam)!
                            .icon
                        }
                      </p>
                      {t(
                        `Sidebar.${
                          categories.find((cat) => cat.name === submenuParam)!
                            .name
                        }`
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </InputBase>
              </Combobox.Target>
              <Combobox.Dropdown>
                {categories.map((cat) => (
                  <Combobox.Option value={cat.name} key={cat.name}>
                    <div className="flex items-center gap-4">
                      <p className="text-[16px] m-0 pb-1">{cat.icon}</p>
                      {t(`Sidebar.${cat.name}`)}
                    </div>
                  </Combobox.Option>
                ))}
              </Combobox.Dropdown>
            </Combobox>
          ) : (
            categories.map((cat) => (
              <UnstyledButton
                component={Link}
                href={`/settings?submenu=${cat.url}`}
                className="dark:hover:bg-slate-800 hover:bg-slate-200/50 flex items-center gap-4 rounded-md px-2 py-3 data-[active=true]:font-bold data-[active=true]:text-blue-400 data-[active=true]:dark:bg-blue-400/10 data-[active=true]:bg-blue-400/10 transition-colors"
                key={cat.name}
                data-active={cat.name === submenuParam || undefined}
              >
                <p className="text-[28px] !leading-[28px] m-0 pb-2">
                  {cat.icon}
                </p>
                {t(`Sidebar.${cat.name}`)}
              </UnstyledButton>
            ))
          )}
        </div>
      </Box>
    );
  }
);

SettingsSidebar.displayName = "SettingsSidebar";
export default SettingsSidebar;
