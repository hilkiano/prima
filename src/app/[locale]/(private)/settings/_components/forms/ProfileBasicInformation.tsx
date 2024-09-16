"use client";

import {
  Box,
  BoxProps,
  Button,
  Input,
  Textarea,
  TextInput,
} from "@mantine/core";
import React from "react";
import useProfileBasicInformation from "../../_hooks/profile_basic_information.hooks";
import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import PhoneCodeSelector from "@/components/PhoneCodeSelector";
import { IconCheck } from "@tabler/icons-react";

const ProfileBasicInformation = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const { mutation, form } = useProfileBasicInformation();
    const tButton = useTranslations("Button");
    const t = useTranslations("Settings.Profile");

    return (
      <Box {...props}>
        <form
          noValidate
          onSubmit={form.handleSubmit((data) => {
            mutation.mutate({
              class: "User",
              payload: {
                payload: data,
              },
            });
          })}
          className="flex flex-col gap-4"
        >
          <Controller
            name="username"
            control={form.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="xs:max-w-[300px] xs:w-auto w-full"
                label={t("label_username")}
                error={form.formState.errors.username?.message}
                autoComplete="off"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            name="display_name"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="xs:max-w-[300px] xs:w-auto w-full"
                label={t("label_display_name")}
                error={form.formState.errors.display_name?.message}
                autoComplete="off"
                value={value}
                onChange={onChange}
                required
              />
            )}
          />
          <div className="flex flex-col">
            <Input.Label>{t("label_phone_number")}</Input.Label>
            <div className="flex flex-row gap-2">
              <Controller
                name="phone_code"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <PhoneCodeSelector
                    onChange={onChange}
                    fieldValue={value}
                    errorString={form.formState.errors.phone_code?.message}
                  />
                )}
              />
              <Controller
                name="phone_number"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="w-full sm:w-[300px]"
                    error={form.formState.errors.phone_number?.message}
                    autoComplete="off"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </div>
          </div>
          <Controller
            name="address"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <Textarea
                label={t("label_address")}
                error={form.formState.errors.address?.message}
                autoComplete="off"
                value={value}
                onChange={onChange}
                autosize
                minRows={2}
                maxRows={4}
              />
            )}
          />
          <div className="mt-4 flex justify-end">
            <Button
              leftSection={<IconCheck />}
              type="submit"
              loading={mutation.isPending}
              className="w-full xs:w-auto"
            >
              {tButton("save")}
            </Button>
          </div>
        </form>
      </Box>
    );
  }
);

ProfileBasicInformation.displayName = "ProfileBasicInformation";
export default ProfileBasicInformation;
