import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale,
    namespace: "Meta.Products_Import",
  });

  return {
    title: t("title", { app_name: process.env.APP_NAME }),
    description: t("description"),
  };
}

export default function ProductsImportLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
