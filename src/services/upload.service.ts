import { showError } from "@/lib/errorHandler";
import { JsonResponse } from "@/types/common.types";

type TBulkUploadResult = {
  [key: string]: string;
};

export async function bulkUpload(formData: FormData) {
  const response = await fetch("/api/upload/bulk", {
    method: "post",
    body: formData,
  })
    .then((res) => res.json())
    .then((res: JsonResponse<TBulkUploadResult[]>) => {
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
