import { getMessageBag } from "@/lib/helpers";
import { GlobalMessage } from "@/types/common.types";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const res = await request.json();
  const cookieStore = cookies();
  const lang = cookieStore.get("NEXT_LOCALE");
  const response = await axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}validate`, res, {
      headers: {
        "x-app-locale": lang ? lang.value : "id",
      },
    })
    .then((res) => {
      return res;
    })
    .catch((res) => {
      return res.response;
    });

  const messageBag: GlobalMessage = await getMessageBag(
    lang ? lang.value : "id",
    "Alert"
  );

  return Response.json(
    { ...response.data, i18n: messageBag },
    { headers: response.headers }
  );
}
