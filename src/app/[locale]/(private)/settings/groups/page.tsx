import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import pick from "lodash/pick";
import {
  NextIntlClientProvider,
  useMessages,
  useTranslations,
} from "next-intl";
import GroupDataTable from "./components/GroupDataTable";
import GroupHead from "./components/GroupHead";

export default async function SettingsGroupsPage() {
  const query = new QueryClient();

  return <SettingsGroupsPageContent query={query} />;
}

type TSettingsGroupsPage = {
  query: QueryClient;
};

function SettingsGroupsPageContent({ query }: TSettingsGroupsPage) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider
      messages={pick(messages, ["Button", "DataTable", "Paginator", "Groups"])}
    >
      <HydrationBoundary state={dehydrate(query)}>
        <GroupHead className="mb-4 md:mb-6" />
        <GroupDataTable />
      </HydrationBoundary>
    </NextIntlClientProvider>
  );
}
