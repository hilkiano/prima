import { Box, BoxProps, Button, PasswordInput } from "@mantine/core";
import { useTranslations } from "next-intl";
import React from "react";
import useProfileSecurity from "../../_hooks/profile_security.hooks";
import { Controller } from "react-hook-form";
import { IconCheck } from "@tabler/icons-react";

const ProfileSecurity = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const tButton = useTranslations("Button");
    const t = useTranslations("Settings.Profile");
    const { mutation, form } = useProfileSecurity();

    return (
      <Box {...props}>
        <form
          onSubmit={form.handleSubmit((data) => {
            mutation.mutate({
              class: "User",
              payload: {
                payload: {
                  id: data.id,
                  password: data.password,
                },
              },
            });
          })}
          className="flex flex-col gap-4 w-full"
          noValidate
        >
          <div className="flex flex-col xs:flex-row gap-4">
            <Controller
              name="password"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <PasswordInput
                  className="w-full"
                  label={t("label_password")}
                  error={form.formState.errors.password?.message}
                  autoComplete="off"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            <Controller
              name="confirm_password"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <PasswordInput
                  className="w-full"
                  label={t("label_confirm_password")}
                  error={form.formState.errors.confirm_password?.message}
                  autoComplete="off"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              leftSection={<IconCheck />}
              type="submit"
              loading={mutation.isPending}
            >
              {tButton("save")}
            </Button>
          </div>
        </form>
      </Box>
    );
  }
);

ProfileSecurity.displayName = "ProfileSecurity";
export default ProfileSecurity;
