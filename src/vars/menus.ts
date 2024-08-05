export const menus: NavbarLinks[] = [
  { label: "Menu.dashboard", icon: "dashboard", link: "/dashboard" },
  {
    label: "Menu.outlets",
    icon: "building-store",
    link: "/outlets",
    privilege: "PAGE_OUTLETS",
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
      },
      {
        label: "Submenu.products_add",
        link: "/products/add",
        privilege: "PAGE_PRODUCTS_ADD_PRODUCT",
      },
      {
        label: "Submenu.products_discounts",
        link: "/products/discounts",
        privilege: "PAGE_PRODUCTS_DISCOUNT",
      },
    ],
  },
  {
    label: "Menu.customers",
    icon: "user-heart",
    link: "/customers",
    privilege: "PAGE_CUSTOMERS",
  },
  {
    label: "Menu.reports",
    icon: "report",
    link: "/reports",
    privilege: "PAGE_REPORTS",
  },
  {
    label: "Menu.settings",
    icon: "settings",
    initiallyOpened: true,
    links: [
      { label: "Submenu.settings_main", link: "/settings" },
      {
        label: "Submenu.settings_users",
        link: "/settings/users",
        privilege: "PAGE_SETTINGS_USERS",
      },
      {
        label: "Submenu.settings_groups",
        link: "/settings/groups",
        privilege: "PAGE_SETTINGS_GROUPS",
      },
      {
        label: "Submenu.settings_membership",
        link: "/settings/membership",
        privilege: "PAGE_SETTINGS_MEMBERSHIP_STATUS",
      },
    ],
  },
];
