import { showError } from "@/lib/errorHandler";
import { GlobalMessage, JsonResponse } from "@/types/common.types";

type TLogin = {
  username: string;
  password: string;
};

export async function handleLogin(messageBag: GlobalMessage, payload: TLogin) {
  const response = await fetch("/api/auth/login", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then(
      (
        res: JsonResponse<{
          user: User;
          privileges: string[] | null;
          subscriptions: Subscription[] | null;
          company: Company | null;
          outlet: Outlet | null;
          token_expired_at: string | null;
        }>
      ) => {
        if (!res.status && res.code !== 422) {
          const err = res as unknown;
          showError(messageBag.alert, err as JsonResponse<null>);
        }
        return res;
      }
    )
    .catch((err) => {
      throw new Error(err.message, err);
    });

  return response;
}

export async function handleLogout(messageBag: GlobalMessage) {
  const response = await fetch("/api/auth/logout", {
    method: "post",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res: JsonResponse<string>) => {
      if (!res.status && res.code !== 422) {
        const err = res as unknown;
        showError(messageBag.alert, err as JsonResponse<null>);
      }
      return res;
    })
    .catch((err) => {
      throw new Error(err.message, err);
    });

  return response;
}
