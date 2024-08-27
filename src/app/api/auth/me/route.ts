import axios from "axios";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const lang = cookieStore.get("NEXT_LOCALE");
  const jwt = cookieStore.get("jwt");
  const response = await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}auth/me`, {
      headers: {
        "x-app-locale": lang ? lang.value : "id",
        "x-token": jwt ? jwt.value : null,
      },
    })
    .then((res) => res)
    .catch((res) => res.response);

  return Response.json(response.data);
}
