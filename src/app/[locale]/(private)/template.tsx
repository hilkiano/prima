import AppShell from "@/components/AppShell";
import { NextIntlClientProvider, useMessages } from "next-intl";
import React from "react";
import pick from "lodash/pick";

export default function Template({ children }: { children: React.ReactNode }) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider
      messages={pick(messages, ["Language", "Navbar", "Button", "Error"])}
    >
      <AppShell
        classNames={{
          main: "bg-white dark:bg-slate-900 pb-16",
          navbar: "bg-white/50 dark:bg-slate-900/75 !p-0",
        }}
        withBorder={false}
        collapsible={false}
        hasAuth
        withMenu
      >
        {children}
      </AppShell>
    </NextIntlClientProvider>
  );
}
