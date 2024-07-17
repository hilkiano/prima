"use client";

import React from "react";
import useLoginPage from "../hooks/loginPage.hooks";
import { Controller } from "react-hook-form";
import { Anchor, Button, PasswordInput, TextInput } from "@mantine/core";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";

type TLoginForm = {};

const LoginForm = React.forwardRef<any, TLoginForm>(() => {
  const tButton = useTranslations("Button");
  const t = useTranslations("Public.Login");

  const { form, mutation } = useLoginPage();

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        mutation.mutate(data);
      })}
    >
      <div className="flex flex-col gap-2">
        <Controller
          control={form.control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              variant="filled"
              label={t("email_label")}
              error={form.formState.errors.email?.message}
              autoComplete="off"
              value={value}
              onChange={onChange}
            />
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <PasswordInput
              variant="filled"
              label={t("password_label")}
              visibilityToggleIcon={({ reveal }) =>
                reveal ? (
                  <i className="ti ti-eye-closed"></i>
                ) : (
                  <i className="ti ti-eye"></i>
                )
              }
              error={form.formState.errors.password?.message}
              autoComplete="off"
              value={value}
              onChange={onChange}
            />
          )}
        />
      </div>
      <div className="flex justify-between items-center mt-6">
        <Anchor size="sm" component={Link} href="/">
          Forgot password?
        </Anchor>
        <Button
          loading={mutation.isPending}
          radius="xl"
          leftSection={<i className="ti ti-send-2"></i>}
          type="submit"
        >
          {tButton("submit")}
        </Button>
      </div>
    </form>
  );
});

LoginForm.displayName = "LoginForm";

export default LoginForm;
