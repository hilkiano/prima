import { showError } from "@/lib/errorHandler";
import {
  Authenticated,
  GlobalMessage,
  JsonResponse,
} from "@/types/common.types";

type TLogin = {
  username: string;
  password: string;
};

export async function handleLogin(payload: TLogin) {
  const response = await fetch("/api/auth/login", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((res: JsonResponse<Authenticated>) => {
      if (!res.status && res.code !== 422) {
        const err = res as unknown;
        showError(res.i18n.alert, err as JsonResponse<null>);
      }
      return res;
    })
    .catch((err) => {
      throw new Error(err.message, err);
    });

  return response;
}

export async function handleLogout() {
  const response = await fetch("/api/auth/logout", {
    method: "post",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res: JsonResponse<string>) => {
      if (!res.status && res.code !== 422) {
        const err = res as unknown;
        showError(res.i18n.alert, err as JsonResponse<null>);
      }
      return res;
    })
    .catch((err) => {
      throw new Error(err.message, err);
    });

  return response;
}
