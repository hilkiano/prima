"use client";

import { useUserContext } from "@/lib/userProvider";
import { useMutation } from "@tanstack/react-query";
import { updateFn } from "@/services/crud.service";
import { showSuccess } from "@/lib/errorHandler";
import { updateUserData } from "@/lib/helpers";

type TCrudCompany = {
  class: string;
  payload: Partial<Company>;
};

export default function useCompanyCurrency() {
  const { setUserData } = useUserContext();

  const mutation = useMutation({
    mutationFn: (data: {
      class: "Company";
      payload: { payload: Partial<Company> };
    }) => updateFn<TCrudCompany, Company>(data),
    onSuccess: (res) => {
      showSuccess(res.i18n.alert, null);
      updateUserData(setUserData);
    },
  });

  return {
    mutation,
  };
}
