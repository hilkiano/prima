import AppShell from "@/components/AppShell";
import { NextIntlClientProvider, useMessages } from "next-intl";
import React from "react";
import pick from "lodash/pick";

export default function Template({ children }: { children: React.ReactNode }) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider
      messages={pick(messages, ["Language", "Navbar", "Button"])}
    >
      <AppShell withBorder={false} collapsible={false}>
        {children}
      </AppShell>
    </NextIntlClientProvider>
  );
}
