export const menus: NavbarLinks[] = [
  { label: "Menu.dashboard", icon: "dashboard", link: "/dashboard" },
  { label: "Menu.outlets", icon: "building-store", link: "/outlets" },
  {
    label: "Menu.products",
    icon: "basket",
    initiallyOpened: true,
    links: [
      {
        label: "Submenu.products_overview",
        link: "/products",
      },
      { label: "Submenu.products_add", link: "/products/add" },
      { label: "Submenu.products_discounts", link: "/products/discounts" },
    ],
  },
  { label: "Menu.customers", icon: "user-heart", link: "/customers" },
  { label: "Menu.reports", icon: "report", link: "/reports" },
  {
    label: "Menu.settings",
    icon: "settings",
    initiallyOpened: true,
    links: [
      { label: "Submenu.settings_main", link: "/settings" },
      { label: "Submenu.settings_users", link: "/settings/users" },
      { label: "Submenu.settings_groups", link: "/settings/groups" },
      { label: "Submenu.settings_membership", link: "/settings/membership" },
    ],
  },
];
