"use client";

import { useGlobalMessageContext } from "@/lib/globalMessageProvider";
import { create, update } from "@/services/crud.service";
import { getList } from "@/services/list.service";
import { JsonResponse, ListResult } from "@/types/common.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function useGroupsForm({
  closeCallback,
}: {
  closeCallback: () => void;
}) {
  const { message } = useGlobalMessageContext();
  const tForm = useTranslations("Form");
  const schema = z.object({
    id: z
      .string()
      .nullish()
      .transform((value) => value || undefined),
    name: z
      .string()
      .min(1, tForm("validation_required"))
      .max(150, tForm("validation_max_char", { max: 150 })),
    description: z.string(),
    privileges: z.string().array().min(1, tForm("validation_required")),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: undefined,
      name: "",
      description: "",
      privileges: [],
    },
  });

  const queryClient = useQueryClient();

  const mutationCreate = useMutation({
    mutationFn: (data: {
      class: "Group";
      payload: { payload: Partial<Group> };
    }) => create(message, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["groupList"] });
      form.reset();
      closeCallback();
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: {
      class: "Group";
      payload: { payload: Partial<Group> };
    }) => update(message, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["groupList"] });
      form.reset();
      closeCallback();
    },
  });

  const query = useQuery<JsonResponse<ListResult<Privilege[]>>>({
    queryFn: async () => {
      return getList(message, {
        model: "Privilege",
        limit: "99999",
      });
    },
    queryKey: ["privilegeList"],
    enabled: false,
  });

  return {
    mutationCreate,
    mutationUpdate,
    query,
    form,
  };
}
