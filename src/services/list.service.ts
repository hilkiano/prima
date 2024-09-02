import { showError } from "@/lib/errorHandler";
import { GlobalMessage, JsonResponse } from "@/types/common.types";

type TList = {
  model: string;
  limit?: string;
  sort?: string;
  sort_direction?: string;
  with_trashed?: "true" | "false";
  relations?: string;
};

export async function getList(messageBag: GlobalMessage, params: TList) {
  const queryParams = new URLSearchParams(params).toString();
  const response = await fetch(`/api/list?${queryParams}`, {
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res: JsonResponse<any>) => {
      if (!res.status && res.code !== 422) {
        const err = res as unknown;
        showError(messageBag.alert, err as JsonResponse<null>);
      }
      return res;
    })
    .catch((err: Error) => {
      throw new Error(err.message, err);
    });

  return response;
}
