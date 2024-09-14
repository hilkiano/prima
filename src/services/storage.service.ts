import { showError } from "@/lib/errorHandler";
import { JsonResponse } from "@/types/common.types";

type TBulkUploadResult = {
  [key: string]: string;
};

type TBulkDeleteRequest = {
  disk: string;
  paths: string[];
};

type TBulkDeleteResult = {
  [key: string]: boolean;
};

export async function bulkUpload(formData: FormData) {
  const response = await fetch("/api/storage/upload/bulk", {
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

export async function bulkDelete(requestData: TBulkDeleteRequest) {
  const response = await fetch("/api/storage/delete/bulk", {
    method: "post",
    body: JSON.stringify(requestData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res: JsonResponse<TBulkDeleteResult[]>) => {
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
