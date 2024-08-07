import { showError } from "@/lib/errorHandler";

export async function handleNewSubscription(
  messageBag: GlobalMessage,
  payload: Omit<Onboarding, "tnc">
) {
  const response = await fetch("/api/subscription/new", {
    method: "post",
    credentials: "include",
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
