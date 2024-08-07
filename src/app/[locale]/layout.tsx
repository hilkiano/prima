import type { Metadata } from "next";
// Styles
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { theme } from "@/styles/theme";
import "@/styles/globals.css";
import "@mantine/notifications/styles.css";
import "@mantine/core/styles.layer.css";
import "@/styles/layout.css";
import { outfitFont } from "@/styles/fonts";

import QueryProvider from "@/lib/queryProvider";
import GlobalMessageProvider from "@/lib/globalMessageProvider";
import { useTranslations } from "next-intl";
import { headers } from "next/headers";
import UserProvider from "@/lib/userProvider";

export const metadata: Metadata = {
  title: "Prima",
  description: "",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const t = useTranslations("Alert");
  const { userData } = getInitialValue();
  const messageBag: GlobalMessage = {
    alert: {
      notification_message_bag: {
        critical_title: t("Notification.critical_title"),
        alert_title: t("Notification.alert_title"),
        info_title: t("Notification.info_title"),
      },
    },
  };

  return (
    <html lang={locale}>
      <head>
        <ColorSchemeScript />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        ></link>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </head>
      <body className={`${outfitFont.variable} font-sans antialiased`}>
        <UserProvider value={userData}>
          <QueryProvider>
            <GlobalMessageProvider value={messageBag}>
              <MantineProvider theme={theme}>
                <Notifications />
                <ModalsProvider>{children}</ModalsProvider>
              </MantineProvider>
            </GlobalMessageProvider>
          </QueryProvider>
        </UserProvider>
      </body>
    </html>
  );
}

function getInitialValue() {
  const headersList = headers();
  let userData: {
    user: User;
    privileges: string[];
    subscriptions: Subscription[];
  } | null = null;

  if (headersList.has("x-userdata")) {
    const userHeaderData = headersList.get("x-userdata");
    const parsedUserData = JSON.parse(userHeaderData ? userHeaderData : "");
    userData = parsedUserData;
  }

  return { userData };
}
