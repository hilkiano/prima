"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "@/lib/userProvider";
import { useMutation } from "@tanstack/react-query";
import { showSuccess } from "@/lib/errorHandler";
import { bulkDelete, bulkUpload } from "@/services/storage.service";
import { formatFileSize, updateUserData } from "@/lib/helpers";
import { CropperRef } from "react-advanced-cropper";
import { updateFn } from "@/services/crud.service";

type TCrudUser = {
  class: string;
  payload: Partial<User>;
};

export default function useProfileAvatar() {
  const tForm = useTranslations("Form");
  const { userData, setUserData } = useUserContext();
  const maxFileSize = 5242880;

  const schema = z.object({
    avatar: z.custom<File | null>().superRefine((file, ctx) => {
      if (file) {
        if (file.size >= maxFileSize) {
          ctx.addIssue({
            message: tForm("validation_max_size_image", {
              max: formatFileSize(maxFileSize),
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
      if (userData) {
        const oldAvatar = new URL(userData.user.avatar_url);
        mutationDelete.mutate({
          disk: "s3",
          paths: [oldAvatar.pathname],
        });
        mutationSave.mutate({
          class: "User",
          payload: {
            payload: {
              id: userData.user.id,
              avatar_url: res.data[0][`${userData.user.id}.webp`],
            },
          },
        });
      }
    },
  });

  const mutationDelete = useMutation({
    mutationFn: bulkDelete,
  });

  const mutationSave = useMutation({
    mutationFn: (data: {
      class: "User";
      payload: { payload: Partial<User> };
    }) => updateFn<TCrudUser, User>(data),
    onSuccess: (res) => {
      showSuccess(res.i18n.alert, null);
      updateUserData(setUserData, () => {
        form.reset();
        setImage(undefined);
      });
    },
  });

  const [image, setImage] = React.useState<string>();
  const cropperRef = React.useRef<CropperRef>(null);
  const onCrop = () => {
    if (cropperRef.current) {
      setImage(cropperRef.current.getCanvas()?.toDataURL("image/webp"));
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
    maxFileSize,
  };
}
