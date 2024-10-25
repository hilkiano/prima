import type { Metadata } from "next";
// Styles
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { theme } from "@/styles/theme";
import "@/styles/globals.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/core/styles.layer.css";
import "@/styles/layout.css";
import "react-advanced-cropper/dist/style.css";
import "react-advanced-cropper/dist/themes/compact.css";
import { outfitFont } from "@/styles/fonts";

import QueryProvider from "@/lib/queryProvider";
import { useTranslations } from "next-intl";
import { headers } from "next/headers";
import UserProvider from "@/lib/userProvider";
import { Authenticated } from "@/types/common.types";

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
            <MantineProvider theme={theme}>
              <Notifications />
              <ModalsProvider>{children}</ModalsProvider>
            </MantineProvider>
          </QueryProvider>
        </UserProvider>
      </body>
    </html>
  );
}

function getInitialValue() {
  const headersList = headers();
  let userData: Authenticated | null = null;

  if (headersList.has("x-userdata")) {
    const userHeaderData = headersList.get("x-userdata");
    const parsedUserData = JSON.parse(userHeaderData ? userHeaderData : "");
    userData = parsedUserData;
  }

  return { userData };
}
