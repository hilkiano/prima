import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import pick from "lodash/pick";
import { NextIntlClientProvider, useMessages } from "next-intl";
import ProductsAddHeader from "./_components/ProductsAddHeader";
import ProductsAddForm from "./_components/ProductsAddForm";
import { getList } from "@/services/list.service";

export default async function ProductsAdd() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["categoryList"],
    queryFn: () =>
      getList({
        model: "ProductCategory",
        limit: "99999",
        sort: "name",
        sort_direction: "asc",
      }),
  });

  await queryClient.prefetchQuery({
    queryKey: ["currencyList"],
    queryFn: () =>
      getList({
        model: "Currency",
        limit: "99999",
        sort: "id",
        sort_direction: "asc",
      }),
  });

  await queryClient.prefetchQuery({
    queryKey: ["outletList"],
    queryFn: () =>
      getList({
        model: "Outlet",
        limit: "99999",
        sort: "name",
        sort_direction: "asc",
      }),
  });

  return <ProductsAddContent query={queryClient} />;
}

type TProductsAdd = {
  query: QueryClient;
};

function ProductsAddContent({ query }: TProductsAdd) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider
      messages={pick(messages, [
        "Form",
        "Products",
        "Button",
        "Notification",
        "Error",
      ])}
    >
      <HydrationBoundary state={dehydrate(query)}>
        <div className="flex flex-col gap-4">
          <ProductsAddHeader className="max-w-[1000px] w-full ml-auto mr-auto" />
          <ProductsAddForm className="rounded-xl p-4 xs:p-8 bg-slate-100 dark:bg-slate-950/40 mt-4 max-w-[1000px] w-full ml-auto mr-auto" />
        </div>
      </HydrationBoundary>
    </NextIntlClientProvider>
  );
}
