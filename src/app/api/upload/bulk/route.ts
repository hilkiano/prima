import { getMessageBag } from "@/lib/helpers";
import { GlobalMessage } from "@/types/common.types";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const data = await request.formData();
  const lang = cookieStore.get("NEXT_LOCALE");
  const jwt = cookieStore.get("jwt");
  const response = await axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}upload/bulk`, data, {
      headers: {
        "x-app-locale": lang ? lang.value : "id",
        "x-token": jwt ? jwt.value : null,
      },
    })
    .then((res) => res)
    .catch((res) => res.response);

  const messageBag: GlobalMessage = await getMessageBag(
    lang ? lang.value : "id",
    "Alert"
  );

  return Response.json(
    { ...response.data, i18n: messageBag },
    { headers: response.headers }
  );
}