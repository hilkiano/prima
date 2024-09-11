import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import pick from "lodash/pick";
import { NextIntlClientProvider, useMessages } from "next-intl";
import SettingsSidebar from "./_components/SettingsSidebar";
import SettingsContainer from "./_components/SettingsContainer";

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
    <NextIntlClientProvider
      messages={pick(messages, ["Form", "Settings", "Button"])}
    >
      <HydrationBoundary state={dehydrate(query)}>
        <div className="flex flex-col lg:flex-row gap-4">
          <SettingsSidebar className="w-full xs:w-[350px] shrink-0" />
          <SettingsContainer className="w-full" />
        </div>
      </HydrationBoundary>
    </NextIntlClientProvider>
  );
}
