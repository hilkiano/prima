import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { JsonResponse, ListResult } from "./common.types";
import { UseFormReturn } from "react-hook-form";

export type TGroupFormState = {
  mutationCreate: UseMutationResult<
    JsonResponse<any>,
    Error,
    {
      class: "Group";
      payload: {
        payload: Partial<Group>;
      };
    },
    unknown
  >;
  mutationUpdate: UseMutationResult<
    JsonResponse<null>,
    Error,
    {
      class: "Group";
      payload: {
        payload: Partial<Group>;
      };
    },
    unknown
  >;
  query: UseQueryResult<JsonResponse<ListResult<Privilege[]>>, Error>;
  form: UseFormReturn<
    {
      id?: string | undefined;
      name: string;
      description: string;
      privileges: string[];
    },
    any,
    undefined
  >;
};
