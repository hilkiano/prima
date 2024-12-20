"use client";

import React from "react";
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
  Center,
} from "@mantine/core";
import { useDisclosure, useHeadroom, useMediaQuery } from "@mantine/hooks";
import ThemeToggle from "./ThemeToggle";
import { useLocale, useTranslations } from "next-intl";
import LocaleToggle from "./LocaleToggle";
import { menus } from "@/vars/menus";
import { NavbarLink } from "./NavbarLink";
import { useUserContext } from "@/lib/userProvider";
import { handleLogout } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { findByScope } from "@/lib/helpers";
import { ForbiddenSvg } from "./Svgs";

type TAppShell = {
  children: React.ReactNode;
  collapsible?: boolean;
  withTheme?: boolean;
  withLocale?: boolean;
  hasAuth?: boolean;
  withMenu?: boolean;
};

const AppShell = React.forwardRef<HTMLDivElement, TAppShell & AppShellProps>(
  (
    {
      children,
      collapsible = true,
      withTheme = true,
      withLocale = true,
      hasAuth = false,
      withMenu = false,
      ...props
    },
    ref
  ) => {
    const { userData } = useUserContext();
    const [opened, { toggle }] = useDisclosure();
    const [modalOpened, { open, close }] = useDisclosure();
    const pinned = useHeadroom({ fixedAt: 120 });
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const tButton = useTranslations("Button");
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
    const tError = useTranslations("Error");
    const t = useTranslations("Navbar");

    const mutation = useMutation({
      mutationFn: handleLogout,
      onSuccess: (res) => {
        if (res.status) {
          router.push("/login");
        }
      },
    });

    let isForbidden: boolean = false;
    const currentMenu = findByScope(menus, pathname);
    if (currentMenu.length > 0) {
      if (currentMenu[0].privilege) {
        if (!userData?.privileges.includes(currentMenu[0].privilege)) {
          isForbidden = true;
        }
      }
    }

    const filteredMenus = menus.filter(
      (menu) =>
        !menu.privilege || userData?.privileges?.includes(menu.privilege!)
    );

    return (
      <MAppShell
        header={{
          height: 60,
          collapsed: collapsible ? !pinned : false,
          offset: hasAuth && withMenu ? true : false,
        }}
        padding="md"
        navbar={{
          width: hasAuth && withMenu ? 280 : 0,
          breakpoint: "md",
          collapsed: { mobile: !opened },
        }}
        classNames={{
          main: "bg-white dark:bg-slate-900",
          navbar: "bg-white/50 dark:bg-slate-900/75 !p-0",
        }}
        {...props}
      >
        <MAppShell.Header className="flex justify-between items-center">
          <Group h="100%" px="md">
            {hasAuth && withMenu ? (
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
          <div className="flex gap-3 items-center pr-3">
            <LocaleToggle className="w-[60px]" locale={locale} />
            <ThemeToggle size="lg" />
            {hasAuth ? (
              <Menu position="bottom-start" trapFocus={false} width={200}>
                <Menu.Target>
                  <Avatar
                    src={userData?.user.avatar_url}
                    alt={userData?.user.display_name}
                    className="cursor-pointer"
                  />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    component={Link}
                    href="/settings?submenu=profile"
                    leftSection={<i className="ti ti-user"></i>}
                  >
                    {t("Avatar.menu_profile")}
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    data-color="red"
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
                onClick={() => mutation.mutate()}
                loading={mutation.isPending}
              >
                {tButton("yes")}
              </Button>
            </div>
          </Modal>
        </MAppShell.Header>
        {hasAuth && withMenu ? (
          <MAppShell.Navbar p="md">
            <ScrollArea>
              {filteredMenus.map((item) => (
                <NavbarLink {...item} key={item.label} onClick={toggle} />
              ))}
            </ScrollArea>
          </MAppShell.Navbar>
        ) : (
          <></>
        )}

        <MAppShell.Main>
          {isForbidden ? (
            <Center className="h-auto  mt-10 md:mt-0">
              <div className="flex flex-col items-center">
                <ForbiddenSvg
                  width={isMobile ? 350 : 600}
                  height={isMobile ? 300 : 500}
                />
                <h1 className="text-3xl md:text-5xl mb-0">
                  {tError("403_head")}
                </h1>
                <h3 className="text-xl md:text-2xl font-light mt-0 text-center">
                  {tError("403_body")}
                </h3>
              </div>
            </Center>
          ) : (
            children
          )}
        </MAppShell.Main>
      </MAppShell>
    );
  }
);

AppShell.displayName = "AppShell";

export default AppShell;
