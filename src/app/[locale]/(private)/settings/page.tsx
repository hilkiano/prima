import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import pick from "lodash/pick";
import { NextIntlClientProvider, useMessages } from "next-intl";
import SettingsSidebar from "./_components/SettingsSidebar";

export default async function SettingsPage() {
  const query = new QueryClient();

  return <SettingsPageContent query={query} />;
}

type TSettingsPage = {
  query: QueryClient;
};

function SettingsPageContent({ query }: TSettingsPage) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider messages={pick(messages, ["Form"])}>
      <HydrationBoundary state={dehydrate(query)}>
        <SettingsSidebar />
      </HydrationBoundary>
    </NextIntlClientProvider>
  );
}
