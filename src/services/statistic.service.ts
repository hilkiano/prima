import { showError } from "@/lib/errorHandler";
import { JsonResponse } from "@/types/common.types";

type TStatistic = {
  model: string;
  type: string;
  all_outlet: "true" | "false";
};

export async function getStatistic(params: TStatistic) {
  const queryParams = new URLSearchParams(params).toString();
  const response = await fetch(`/api/statistic?${queryParams}`, {
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res: JsonResponse<any>) => {
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
