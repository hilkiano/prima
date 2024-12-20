import { getFn } from "@/services/crud.service";
import { JsonResponse } from "@/types/common.types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import pick from "lodash/pick";
import { NextIntlClientProvider, useMessages } from "next-intl";
import ProductContainer from "./_components/ProductContainer";

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
        <ProductContainer className="max-w-[1000px] w-full ml-auto mr-auto flex flex-col gap-4" />
      </HydrationBoundary>
    </NextIntlClientProvider>
  );
}
