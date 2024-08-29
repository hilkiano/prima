import { showError } from "@/lib/errorHandler";
import { GlobalMessage, JsonResponse } from "@/types/common.types";

export type TValidate = {
  model: string;
  column: string;
  value: string;
  strict?: boolean;
  case_sensitive?: boolean;
};

export async function handleValidate(
  messageBag: GlobalMessage,
  payload: TValidate
) {
  const response = await fetch("/api/validate", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((res: JsonResponse<boolean>) => {
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
