import AppShell from "@/components/AppShell";
import { NextIntlClientProvider, useMessages } from "next-intl";
import pick from "lodash/pick";
import ErrorPage from "@/components/ErrorPage";

export default function NotFound() {
  const messages = useMessages();

  return (
    <NextIntlClientProvider
      messages={pick(messages, ["Language", "Navbar", "Button", "Error"])}
    >
      <AppShell withBorder={false} collapsible={false}>
        <ErrorPage type="404" />
      </AppShell>
    </NextIntlClientProvider>
  );
}
