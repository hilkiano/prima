import {
  NextIntlClientProvider,
  useMessages,
  useTranslations,
} from "next-intl";
import pick from "lodash/pick";
import { Center, Divider } from "@mantine/core";
import LoginForm from "./components/LoginForm";
import Image from "next/image";
import SocialButtonContainer from "./components/SocialButtonContainer";

export default function LoginPage() {
  const messages = useMessages();
  const t = useTranslations("Public.Login");

  return (
    <NextIntlClientProvider
      messages={pick(messages, ["Button", "Public.Login", "Error"])}
    >
      <Center className="h-auto md:h-[calc(100vh-32px)] mt-10 md:mt-0">
        <div className="pt-4 md:pt-0 flex flex-col gap-2 w-full md:w-[420px]">
          <div className="flex justify-center items-center mb-4">
            <Image
              src="/images/logo.png"
              width={80}
              height={80}
              alt="Picture of the author"
              className=""
            />
          </div>
          <h1 className="text-xl md:text-2xl opacity-75 font-medium m-0">
            {t("head")}
          </h1>
          <h2 className="text-lg md:text-xl opacity-75 font-light -mt-2">
            {t("subhead")}
          </h2>
          <div className="w-full flex flex-col gap-3 md:gap-5">
            <div className="flex items-center gap-2">
              <SocialButtonContainer />
            </div>
            <Divider label={t("divider")} />
            <LoginForm />
          </div>
        </div>
      </Center>
    </NextIntlClientProvider>
  );
}
