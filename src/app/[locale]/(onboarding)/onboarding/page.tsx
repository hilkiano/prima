import { NextIntlClientProvider, useMessages } from "next-intl";
import pick from "lodash/pick";
import OnboardingFinish from "./components/OnboardingFinish";
import { Center } from "@mantine/core";
import { headers } from "next/headers";
import OnboardingContainer from "./components/OnboardingContainer";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getList } from "@/services/list.service";

export default async function OnboardingPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["phoneCodeList"],
    queryFn: () =>
      getList({
        model: "PhoneCode",
        limit: "99999",
      }),
  });

  return <OnboardingPageContent queryClient={queryClient} />;
}

type TOnboardingPage = {
  queryClient: QueryClient;
};

function OnboardingPageContent({ queryClient }: TOnboardingPage) {
  const messages = useMessages();
  const headersList = headers();
  let userData = null;
  if (headersList.get("x-userdata")) {
    userData = JSON.parse(headersList.get("x-userdata")!);
  }

  return (
    <NextIntlClientProvider
      messages={pick(messages, ["Button", "Onboarding", "Form"])}
    >
      {userData?.user.company_id ? (
        <Center className="h-auto md:h-[calc(100vh-32px)] mt-10 md:mt-0">
          <OnboardingFinish className="flex flex-col items-center text-center max-w-[600px]" />
        </Center>
      ) : (
        <HydrationBoundary state={dehydrate(queryClient)}>
          <OnboardingContainer className="flex justify-center w-full" />
        </HydrationBoundary>
      )}
    </NextIntlClientProvider>
  );
}
