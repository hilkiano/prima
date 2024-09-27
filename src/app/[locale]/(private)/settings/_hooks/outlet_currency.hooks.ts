"use client";

import { useUserContext } from "@/lib/userProvider";
import { useMutation } from "@tanstack/react-query";
import { updateFn } from "@/services/crud.service";
import { showSuccess } from "@/lib/errorHandler";
import { updateUserData } from "@/lib/helpers";

type TCrudOutlet = {
  class: string;
  payload: Partial<Outlet>;
};

export default function useOutletCurrency() {
  const { setUserData } = useUserContext();

  const mutation = useMutation({
    mutationFn: (data: {
      class: "Outlet";
      payload: { payload: Partial<Outlet> };
    }) => updateFn<TCrudOutlet, Outlet>(data),
    onSuccess: (res) => {
      showSuccess(res.i18n.alert, null);
      updateUserData(setUserData);
    },
  });

  return {
    mutation,
  };
}
