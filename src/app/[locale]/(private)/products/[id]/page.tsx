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
  const cookieStore = cookies();
  const lang = cookieStore.get("NEXT_LOCALE");
  const jwt = cookieStore.get("jwt");
  const request = await axios
    .get(
      `${process.env.SERVER_API_URL}crud/get/Product/${slug.id}/category&variants.batches`,
      {
        headers: {
          "x-app-locale": lang ? lang.value : "id",
          "x-token": jwt ? jwt.value : null,
        },
        withCredentials: true,
      }
    )
    .then((res) => res)
    .catch((res) => res.response);

  if (request.status !== 200) {
    return "not oke";
  }

  queryClient.prefetchQuery({
    queryKey: ["productData"],
    queryFn: () =>
      getFn<Product>({
        class: "Product",
        id: slug.id,
        relations:
          "category&variants.batches.outlet&variants.batches.currency&createdUser&updatedUser",
      }),
  });

  return <ProductsContent query={queryClient} data={request.data} />;
}

type TProducts = {
  query: QueryClient;
  data: JsonResponse<Product>;
};

function ProductsContent({ query, data }: TProducts) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider
      messages={pick(messages, ["Form", "Products", "Button", "Notification"])}
    >
      <HydrationBoundary state={dehydrate(query)}>
        <ProductContainer
          className="max-w-[1000px] w-full ml-auto mr-auto flex flex-col gap-4"
          data={data}
        />
      </HydrationBoundary>
    </NextIntlClientProvider>
  );
}
