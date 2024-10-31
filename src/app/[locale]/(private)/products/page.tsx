import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import pick from "lodash/pick";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getList } from "@/services/list.service";
import ProductsHeader from "./_components/ProductsHeader";
import { getStatistic } from "@/services/statistic.service";
import ProductsDataContainer from "./_components/ProductsDataContainer";

export default async function Products() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["productStatistic"],
    queryFn: () =>
      getStatistic({
        model: "Product",
        type: "total_all,total_active,total_inactive",
        all_outlet: "true",
      }),
  });

  await queryClient.prefetchQuery({
    queryKey: ["productList"],
    queryFn: () =>
      getList({
        model: "Product",
        with_trashed: "true",
        relations: "category&variants.batches",
      }),
  });

  return <ProductsContent query={queryClient} />;
}

type TProducts = {
  query: QueryClient;
};

function ProductsContent({ query }: TProducts) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider
      messages={pick(messages, [
        "Form",
        "Products",
        "Button",
        "Notification",
        "Data",
      ])}
    >
      <HydrationBoundary state={dehydrate(query)}>
        <div className="flex flex-col gap-4">
          <ProductsHeader className="w-full" />
          <ProductsDataContainer className="w-full" />
        </div>
      </HydrationBoundary>
    </NextIntlClientProvider>
  );
}
