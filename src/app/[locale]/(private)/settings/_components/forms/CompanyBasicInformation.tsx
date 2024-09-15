import {
  Box,
  BoxProps,
  Button,
  Input,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import React from "react";
import useCompanyBasicInformation from "../../_hooks/company_basic_information.hooks";
import { Controller } from "react-hook-form";
import PhoneCodeSelector from "@/components/PhoneCodeSelector";
import { IconCheck } from "@tabler/icons-react";

const CompanyBasicInformation = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const { mutation, form } = useCompanyBasicInformation();
    const tButton = useTranslations("Button");
    const t = useTranslations("Settings.Company");
    return (
      <Box {...props}>
        <form
          noValidate
          onSubmit={form.handleSubmit((data) => {
            mutation.mutate({
              class: "Company",
              payload: {
                payload: data,
              },
            });
          })}
          className="flex flex-col gap-4"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="w-full sm:w-[300px]"
                label={t("label_name")}
                error={form.formState.errors.name?.message}
                autoComplete="off"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="w-full sm:w-[300px]"
                label={t("label_email")}
                error={form.formState.errors.email?.message}
                autoComplete="off"
                value={value}
                onChange={onChange}
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

          <div className="flex justify-end mt-4">
            <Button
              leftSection={<IconCheck />}
              loading={mutation.isPending}
              type="submit"
            >
              {tButton("save")}
            </Button>
          </div>
        </form>
      </Box>
    );
  }
);

CompanyBasicInformation.displayName = "CompanyBasicInformation";
export default CompanyBasicInformation;
