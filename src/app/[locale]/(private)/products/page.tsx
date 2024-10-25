import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import pick from "lodash/pick";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getList } from "@/services/list.service";
import ProductsHeader from "./_components/ProductsHeader";

export default async function Products() {
  const queryClient = new QueryClient();

  return <ProductsContent query={queryClient} />;
}

type TProducts = {
  query: QueryClient;
};

function ProductsContent({ query }: TProducts) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider
      messages={pick(messages, ["Form", "Products", "Button", "Notification"])}
    >
      <HydrationBoundary state={dehydrate(query)}>
        <div className="flex flex-col gap-4">
          <ProductsHeader className="w-full" />
        </div>
      </HydrationBoundary>
    </NextIntlClientProvider>
  );
}
