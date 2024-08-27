import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const searchParams = request.nextUrl.searchParams;
  const lang = cookieStore.get("NEXT_LOCALE");
  const jwt = cookieStore.get("jwt");
  const response = await axios
    .get(
      `${process.env.NEXT_PUBLIC_API_URL}list${
        searchParams ? `?${searchParams.toString()}` : "/"
      }`,
      {
        headers: {
          "x-app-locale": lang ? lang.value : "id",
          "x-token": jwt ? jwt.value : null,
        },
      }
    )
    .then((res) => res)
    .catch((res) => res.response);

  return Response.json(response.data);
}
