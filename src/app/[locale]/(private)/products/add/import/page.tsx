import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import pick from "lodash/pick";
import { NextIntlClientProvider, useMessages } from "next-intl";
import ProductsImportHeader from "./_components/ProductsImportHeader";
import ProductsImportContainer from "./_components/ProductsImportContainer";

export default async function ProductsImport() {
  const queryClient = new QueryClient();

  return <ProductsImportContent query={queryClient} />;
}

type TProductsImport = {
  query: QueryClient;
};

function ProductsImportContent({ query }: TProductsImport) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider
      messages={pick(messages, ["Form", "Products", "Button", "Notification"])}
    >
      <HydrationBoundary state={dehydrate(query)}>
        <div className="flex flex-col gap-4">
          <ProductsImportHeader className="flex gap-4 items-center max-w-[1000px] w-full ml-auto mr-auto" />
          <ProductsImportContainer className="rounded-xl p-4 xs:p-8 bg-slate-100 dark:bg-slate-950/40 mt-4 max-w-[1000px] w-full ml-auto mr-auto" />
        </div>
      </HydrationBoundary>
    </NextIntlClientProvider>
  );
}
