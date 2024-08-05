import { NextIntlClientProvider, useMessages } from "next-intl";
import pick from "lodash/pick";
import OnboardingFinish from "./components/OnboardingFinish";
import { Center } from "@mantine/core";
import { headers } from "next/headers";
import OnboardingContainer from "./components/OnboardingContainer";

export default function OnboardingPage() {
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
        <OnboardingContainer className="flex justify-center w-full" />
      )}
    </NextIntlClientProvider>
  );
}
