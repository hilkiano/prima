"use client";

import React from "react";
import {
  createFn,
  updateFn,
  deleteFn,
  restoreFn,
} from "@/services/crud.service";
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
  const [data, setData] = React.useState<Group | null>(null);

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
    }) => createFn(data),
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
    }) => updateFn(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["groupList"] });
      form.reset();
      closeCallback();
    },
  });

  const mutationDelete = useMutation({
    mutationFn: (data: {
      class: "Group";
      payload: { payload: Partial<Group> };
    }) => deleteFn(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["groupList"] });
    },
  });

  const mutationRestore = useMutation({
    mutationFn: (data: {
      class: "Group";
      payload: { payload: Partial<Group> };
    }) => restoreFn(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["groupList"] });
    },
  });

  const query = useQuery<JsonResponse<ListResult<Privilege[]>>>({
    queryFn: async () => {
      return getList({
        model: "Privilege",
        limit: "99999",
      });
    },
    queryKey: ["privilegeList"],
    enabled: false,
  });

  React.useEffect(() => {
    if (data) {
      form.setValue("id", data.id);
      form.setValue("name", data.name);
      form.setValue("description", data.description ?? "");
      form.setValue("privileges", data.privileges);
    }
  }, [data, form]);

  return {
    mutationCreate,
    mutationUpdate,
    mutationDelete,
    mutationRestore,
    query,
    form,
    data,
    setData,
  };
}
