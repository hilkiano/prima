import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  const cookieStore = cookies();
  const data = await request.json();
  const lang = cookieStore.get("NEXT_LOCALE");
  const jwt = cookieStore.get("jwt");
  const response = await axios
    .put(
      `${process.env.NEXT_PUBLIC_API_URL}crud/create/${data.class}`,
      data.payload,
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

export async function PATCH(request: NextRequest) {
  const cookieStore = cookies();
  const data = await request.json();
  const lang = cookieStore.get("NEXT_LOCALE");
  const jwt = cookieStore.get("jwt");
  const response = await axios
    .patch(
      `${process.env.NEXT_PUBLIC_API_URL}crud/update/${data.class}`,
      data.payload,
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