import {
  Box,
  BoxProps,
  Button,
  Input,
  Textarea,
  TextInput,
} from "@mantine/core";
import React from "react";
import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import useOnboarding from "../hooks/onboarding.hooks";
import useOnboardingCompanyInfo from "../hooks/onboarding.company_info.hooks";
import PhoneCodeSelector from "@/components/PhoneCodeSelector";

type TOnboardingCompanyInfo = {};

const OnboardingCompanyInfo = React.forwardRef<
  HTMLDivElement,
  TOnboardingCompanyInfo & BoxProps
>(({ ...props }, ref) => {
  const tButton = useTranslations("Button");
  const t = useTranslations("Onboarding.CompanyInfo");
  const { onboardingData, saveOnboardingData, handleStep } = useOnboarding();
  const { form } = useOnboardingCompanyInfo();

  React.useEffect(() => {
    if (
      onboardingData.company_info &&
      Object.keys(onboardingData.company_info).length !== 0
    ) {
      form.setValue("name", onboardingData.company_info.name);
      form.setValue("phone_number", onboardingData.company_info.phone_number);
      form.setValue("email", onboardingData.company_info.email);
      form.setValue("address", onboardingData.company_info.address);
      form.setValue(
        "phone_code",
        onboardingData.company_info.phone_code
          ? onboardingData.company_info.phone_code
          : ""
      );
    }
  }, [form, onboardingData]);

  return (
    <Box id="onboarding-company-info" {...props}>
      <form
        noValidate
        onSubmit={form.handleSubmit((data) => {
          saveOnboardingData("company_info", {
            name: data.name,
            email: data.email,
            address: data.address,
            phone_code: data.phone_code,
            phone_number: data.phone_number,
          });
          handleStep(2);
        })}
        className="flex flex-col gap-4"
      >
        <Controller
          name="name"
          control={form.control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="w-full"
              label={t("label_name")}
              error={form.formState.errors.name?.message}
              autoComplete="off"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              required
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
              required
            />
          )}
        />
        <div className="flex flex-col">
          <Input.Label required>{t("label_phone_number")}</Input.Label>
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
                  required
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
              required
            />
          )}
        />

        <div className="flex justify-between mt-6">
          <Button
            leftSection={<i className="ti ti-arrow-left"></i>}
            type="button"
            variant="subtle"
            onClick={() => handleStep(0)}
          >
            {tButton("previous")}
          </Button>
          <Button
            leftSection={<i className="ti ti-arrow-right"></i>}
            type="submit"
          >
            {tButton("next")}
          </Button>
        </div>
      </form>
    </Box>
  );
});

OnboardingCompanyInfo.displayName = "OnboardingCompanyInfo";

export default OnboardingCompanyInfo;
