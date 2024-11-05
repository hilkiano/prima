import { NavbarLinks } from "@/types/common.types";

export const menus: NavbarLinks[] = [
  {
    label: "Menu.dashboard",
    icon: "dashboard",
    link: "/dashboard",
    activeScope: ["/dashboard"],
  },
  {
    label: "Menu.products",
    icon: "basket",
    initiallyOpened: true,
    privilege: "PAGE_PRODUCTS_OVERVIEW",
    links: [
      {
        label: "Submenu.products_overview",
        link: "/products",
        privilege: "PAGE_PRODUCTS_OVERVIEW",
        activeScope: ["/products"],
      },
      {
        label: "Submenu.products_add",
        link: "/products/add",
        privilege: "PAGE_PRODUCTS_ADD_PRODUCT",
        activeScope: ["/products/add", "/products/add/import"],
      },
    ],
  },
  {
    label: "Menu.reports",
    icon: "report",
    link: "/reports",
    privilege: "PAGE_REPORTS",
    activeScope: ["/reports"],
  },
  {
    label: "Menu.settings",
    icon: "settings",
    initiallyOpened: true,
    links: [
      {
        label: "Submenu.settings_main",
        link: "/settings",
        activeScope: ["/settings"],
      },
      {
        label: "Submenu.settings_users",
        link: "/settings/users",
        privilege: "PAGE_SETTINGS_USERS",
        activeScope: ["/settings/users"],
      },
      {
        label: "Submenu.settings_groups",
        link: "/settings/groups",
        privilege: "PAGE_SETTINGS_GROUPS",
        activeScope: ["/settings/groups"],
      },
      {
        label: "Submenu.settings_membership",
        link: "/settings/membership",
        privilege: "PAGE_SETTINGS_MEMBERSHIP_STATUS",
        activeScope: ["/settings/membership"],
      },
    ],
  },
];
