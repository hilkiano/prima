import { Box } from "@mantine/core";
import { NextIntlClientProvider, useMessages } from "next-intl";
import pick from "lodash/pick";
import UserCard from "./components/UserCard";
import { headers } from "next/headers";

export default function DashboardPage() {
  let userData: Authenticated | null = null;
  const headersList = headers();
  if (headersList.get("x-userdata")) {
    userData = JSON.parse(headersList.get("x-userdata")!);
  }

  const messages = useMessages();

  return (
    <NextIntlClientProvider messages={pick(messages, ["Dashboard"])}>
      <Box className="-mt-[14px] flex flex-col md:flex-row gap-8">
        <UserCard
          user={userData?.user}
          company={userData?.company}
          outlet={userData?.outlet}
          token_expired_at={userData?.token_expired_at}
          className="w-full md:w-[450px] rounded-lg p-2 dark:bg-slate-800 bg-slate-100"
        />
        <h1 className="m-0">News feed</h1>
      </Box>
    </NextIntlClientProvider>
  );
}
