"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "@/lib/userProvider";
import { useMutation } from "@tanstack/react-query";
import { Authenticated, JsonResponse } from "@/types/common.types";
import { showSuccess } from "@/lib/errorHandler";
import { bulkUpload } from "@/services/upload.service";
import { formatFileSize } from "@/lib/helpers";
import { CropperRef } from "react-advanced-cropper";
import { updateFn } from "@/services/crud.service";

export default function useProfileAvatar() {
  const tForm = useTranslations("Form");
  const t = useTranslations("Settings.Profile");
  const { userData, setUserData } = useUserContext();

  const schema = z.object({
    avatar: z.custom<File | null>().superRefine((file, ctx) => {
      if (file) {
        if (file.size >= 1048576) {
          ctx.addIssue({
            message: tForm("validation_max_size_image", {
              max: formatFileSize(1048576),
            }),
            code: z.ZodIssueCode.custom,
          });
        }
      }
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      avatar: null,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const mutationUpload = useMutation({
    mutationFn: bulkUpload,
    onSuccess: (res) => {
      mutationSave.mutate({
        class: "User",
        payload: {
          payload: {
            id: userData?.user.id,
            avatar_url: res.data[0][`${userData?.user.id}.png`],
          },
        },
      });
    },
  });

  const mutationSave = useMutation({
    mutationFn: (data: {
      class: "User";
      payload: { payload: Partial<User> };
    }) => updateFn(data),
    onSuccess: (res) => {
      showSuccess(res.i18n.alert, null);
      updateUserData();
    },
  });

  const updateUserData = async () => {
    await fetch(`/api/auth/me`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res: JsonResponse<Authenticated>) => {
        setUserData(res.data);
        form.reset();
        setImage(undefined);
      })
      .catch((err: Error) => {
        throw new Error(err.message, err);
      });
  };
  const [image, setImage] = React.useState<string>();
  const cropperRef = React.useRef<CropperRef>(null);
  const onCrop = () => {
    if (cropperRef.current) {
      setImage(cropperRef.current.getCanvas()?.toDataURL());
    }
  };

  return {
    mutationUpload,
    mutationSave,
    form,
    image,
    setImage,
    cropperRef,
    onCrop,
  };
}
