import { showError } from "@/lib/errorHandler";
import { JsonResponse } from "@/types/common.types";

export async function importTemplate(formData: FormData) {
  const response = await fetch("/api/upload", {
    method: "post",
    body: formData,
  })
    .then((res) => res.json())
    .then((res: JsonResponse<any>) => {
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
