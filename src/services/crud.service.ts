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

export async function createFn<T>(requestData: TCreate<T>) {
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
      if (!res.status) {
        const err = res as unknown;
        showError(res.i18n.alert, err as JsonResponse<null>);
      }
      return res;
    })
    .catch((err: Error) => {
      throw new Error(err.message, err);
    });

  return response;
}

export async function updateFn<T>(requestData: TUpdate<T>) {
  const response = await fetch(`/api/crud`, {
    method: "PATCH",
    body: JSON.stringify(requestData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res: JsonResponse<T>) => {
      if (!res.status) {
        const err = res as unknown;
        showError(res.i18n.alert, err as JsonResponse<null>);
      }
      return res;
    })
    .catch((err: Error) => {
      throw new Error(err.message, err);
    });

  return response;
}

export async function deleteFn<T>(requestData: TUpdate<T>) {
  const response = await fetch(`/api/crud`, {
    method: "DELETE",
    body: JSON.stringify(requestData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res: JsonResponse<null>) => {
      if (!res.status) {
        const err = res as unknown;
        showError(res.i18n.alert, err as JsonResponse<null>);
      }
      return res;
    })
    .catch((err: Error) => {
      throw new Error(err.message, err);
    });

  return response;
}

export async function restoreFn<T>(requestData: TUpdate<T>) {
  const response = await fetch(`/api/crud`, {
    method: "POST",
    body: JSON.stringify(requestData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res: JsonResponse<null>) => {
      if (!res.status) {
        const err = res as unknown;
        showError(res.i18n.alert, err as JsonResponse<null>);
      }
      return res;
    })
    .catch((err: Error) => {
      throw new Error(err.message, err);
    });

  return response;
}
