import { getFn } from "@/services/crud.service";
import { JsonResponse } from "@/types/common.types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import pick from "lodash/pick";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { cookies } from "next/headers";
import ProductUpdateFormContainer from "./_components/ProductUpdateFormContainer";
import ProductUpdateHeader from "./_components/ProductUpdateHeader";
import { getList } from "@/services/list.service";

export default async function Products({
  params,
}: {
  params: Promise<{
    locale: "en" | "id";
    id: string;
  }>;
}) {
  const queryClient = new QueryClient();
  const slug = await params;

  await queryClient.prefetchQuery({
    queryKey: ["productData", slug.id],
    queryFn: () =>
      getFn<Product>({
        class: "Product",
        id: slug.id,
        relations:
          "category&variants.batches.outlet&variants.batches.currency&createdUser&updatedUser",
      }),
  });

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
    queryKey: ["outletList"],
    queryFn: () =>
      getList({
        model: "Outlet",
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
        <ProductUpdateHeader className="max-w-[1000px] w-full ml-auto mr-auto flex flex-col gap-4" />
        <ProductUpdateFormContainer className="rounded-xl p-4 xs:p-8 bg-slate-100 dark:bg-slate-950/40 mt-4 max-w-[1000px] w-full ml-auto mr-auto" />
      </HydrationBoundary>
    </NextIntlClientProvider>
  );
}
