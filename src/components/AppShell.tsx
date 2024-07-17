"use client";

import React, { useState } from "react";
import {
  AppShell as MAppShell,
  AppShellProps,
  Avatar,
  Group,
  Burger,
  ScrollArea,
  Menu,
  useMantineTheme,
  Modal,
  Button,
} from "@mantine/core";
import { useDisclosure, useHeadroom, useMediaQuery } from "@mantine/hooks";
import ThemeToggle from "./ThemeToggle";
import { useLocale, useTranslations } from "next-intl";
import LocaleToggle from "./LocaleToggle";
import { menus } from "@/vars/menus";
import { NavbarLink } from "./NavbarLink";
import { useUserContext } from "@/lib/userProvider";
import { handleLogout } from "@/services/auth.service";
import { useGlobalMessageContext } from "@/lib/globalMessageProvider";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@/lib/navigation";
import { modals } from "@mantine/modals";

type TAppShell = {
  children: React.ReactNode;
  collapsible?: boolean;
  withTheme?: boolean;
  withLocale?: boolean;
  hasAuth?: boolean;
};

const AppShell = React.forwardRef<HTMLDivElement, TAppShell & AppShellProps>(
  (
    {
      children,
      collapsible = true,
      withTheme = true,
      withLocale = true,
      hasAuth = false,
      ...props
    },
    ref
  ) => {
    const { userData } = useUserContext();
    const [opened, { toggle }] = useDisclosure();
    const [modalOpened, { open, close }] = useDisclosure();
    const pinned = useHeadroom({ fixedAt: 120 });
    const locale = useLocale();
    const { message } = useGlobalMessageContext();
    const router = useRouter();
    const tButton = useTranslations("Button");
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
    const t = useTranslations("Navbar");

    const mutation = useMutation({
      mutationFn: handleLogout,
      onSuccess: () => {
        router.push("/login");
      },
    });

    return (
      <MAppShell
        header={{
          height: 60,
          collapsed: collapsible ? !pinned : false,
          offset: hasAuth ? true : false,
        }}
        padding="md"
        navbar={{
          width: hasAuth ? 280 : 0,
          breakpoint: "md",
          collapsed: { mobile: !opened },
        }}
        classNames={{
          header: "bg-white dark:bg-stone-800",
          main: "bg-white dark:bg-stone-800 !ml-3",
          navbar: "bg-white/50 dark:bg-stone-800/75 !p-0",
        }}
        {...props}
      >
        <MAppShell.Header className="flex justify-between items-center px-3">
          <Group h="100%" px="md">
            {hasAuth ? (
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="md"
                size="md"
              />
            ) : (
              <></>
            )}
          </Group>
          <div className="flex gap-3 items-center">
            <LocaleToggle className="w-[60px]" locale={locale} />
            <ThemeToggle size="lg" />
            {hasAuth ? (
              <Menu withArrow width={200}>
                <Menu.Target>
                  <Avatar
                    src={userData?.avatar_url}
                    alt={userData?.display_name}
                  />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<i className="ti ti-user"></i>}>
                    {t("Avatar.menu_profile")}
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={<i className="ti ti-logout-2"></i>}
                    onClick={open}
                  >
                    {t("Avatar.menu_logout")}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <></>
            )}
          </div>

          <Modal
            opened={modalOpened}
            onClose={close}
            title={t("Avatar.menu_logout")}
            closeOnClickOutside={false}
            centered={!isMobile ? true : false}
          >
            <p>{t("Avatar.menu_logout_modal_body")}</p>
            <div className="flex justify-end gap-3">
              <Button variant="transparent" onClick={close}>
                {tButton("no")}
              </Button>
              <Button
                variant="filled"
                color="red"
                onClick={() => mutation.mutate(message)}
                loading={mutation.isPending}
              >
                {tButton("yes")}
              </Button>
            </div>
          </Modal>
        </MAppShell.Header>
        {hasAuth ? (
          <MAppShell.Navbar p="md">
            <ScrollArea>
              {/* TODO: Add privilege per menu item */}
              {menus.map((item) => (
                <NavbarLink {...item} key={item.label} />
              ))}
            </ScrollArea>
          </MAppShell.Navbar>
        ) : (
          <></>
        )}

        <MAppShell.Main>{children}</MAppShell.Main>
      </MAppShell>
    );
  }
);

AppShell.displayName = "AppShell";

export default AppShell;
