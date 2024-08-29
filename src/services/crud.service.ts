import { showError } from "@/lib/errorHandler";
import { GlobalMessage, JsonResponse } from "@/types/common.types";

type TCreate<T> = {
  class: string;
  payload: Partial<T>;
};

type TUpdate<T> = {
  class: string;
  payload: Partial<T>;
};

export async function create<T>(
  messageBag: GlobalMessage,
  requestData: TCreate<T>
) {
  const response = await fetch(`/api/crud`, {
    method: "PUT",
    body: JSON.stringify(requestData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res: JsonResponse<T>) => {
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

export async function update<T>(
  messageBag: GlobalMessage,
  requestData: TUpdate<T>
) {
  const response = await fetch(`/api/crud`, {
    method: "PATCH",
    body: JSON.stringify(requestData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res: JsonResponse<null>) => {
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
