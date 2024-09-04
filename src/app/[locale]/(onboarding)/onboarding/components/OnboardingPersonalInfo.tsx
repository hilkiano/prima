import {
  Box,
  BoxProps,
  Button,
  Input,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import React from "react";
import useOnboardingPersonalInfo from "../hooks/onboarding.personal_info.hooks";
import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import useOnboarding from "../hooks/onboarding.hooks";
import PhoneCodeSelector from "@/components/PhoneCodeSelector";

type TOnboardingPersonalInfo = {};

const OnboardingPersonalInfo = React.forwardRef<
  HTMLDivElement,
  TOnboardingPersonalInfo & BoxProps
>(({ ...props }, ref) => {
  const tButton = useTranslations("Button");
  const t = useTranslations("Onboarding.PersonalInfo");
  const { onboardingData, saveOnboardingData, handleStep } = useOnboarding();
  const { form, genderOptions } = useOnboardingPersonalInfo();

  React.useEffect(() => {
    if (
      onboardingData.personal_info &&
      Object.keys(onboardingData.personal_info).length !== 0
    ) {
      form.setValue("family_name", onboardingData.personal_info.family_name);
      form.setValue("given_name", onboardingData.personal_info.given_name);
      form.setValue(
        "gender",
        onboardingData.personal_info.gender as
          | "male"
          | "female"
          | "not_answered"
      );
      form.setValue(
        "phone_code",
        onboardingData.personal_info.phone_code
          ? onboardingData.personal_info.phone_code
          : ""
      );
      form.setValue("phone_number", onboardingData.personal_info.phone_number);
      form.setValue("email", onboardingData.personal_info.email);
      form.setValue("address", onboardingData.personal_info.address);
    }
  }, [form, onboardingData]);

  return (
    <Box id="onboarding-personal-info" {...props}>
      <form
        noValidate
        onSubmit={form.handleSubmit((data) => {
          saveOnboardingData("personal_info", {
            given_name: data.given_name,
            family_name: data.family_name,
            gender: data.gender,
            email: data.email,
            phone_code: data.phone_code,
            phone_number: data.phone_number,
            address: data.address,
          });
          handleStep(1);
        })}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <Controller
            name="given_name"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="w-full"
                label={t("label_first_name")}
                error={form.formState.errors.given_name?.message}
                autoComplete="off"
                value={value}
                onChange={onChange}
                required
              />
            )}
          />
          <Controller
            name="family_name"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="w-full"
                label={t("label_last_name")}
                error={form.formState.errors.family_name?.message}
                autoComplete="off"
                value={value}
                onChange={onChange}
              />
            )}
          />
        </div>
        <Controller
          name="gender"
          control={form.control}
          render={({ field: { onChange, value } }) => (
            <Select
              className="w-full sm:w-[250px]"
              label={t("label_gender")}
              error={form.formState.errors.gender?.message}
              data={genderOptions}
              value={value}
              onChange={onChange}
              required
              allowDeselect={false}
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

        <Button
          className="mt-6 self-end"
          leftSection={<i className="ti ti-arrow-right"></i>}
          type="submit"
        >
          {tButton("next")}
        </Button>
      </form>
    </Box>
  );
});

OnboardingPersonalInfo.displayName = "OnboardingPersonalInfo";

export default OnboardingPersonalInfo;
