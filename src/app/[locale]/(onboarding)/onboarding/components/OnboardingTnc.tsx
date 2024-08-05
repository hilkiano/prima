import {
  Box,
  BoxProps,
  Button,
  Checkbox,
  ScrollArea,
  Textarea,
  TextInput,
} from "@mantine/core";
import React from "react";
import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import useOnboarding from "../hooks/onboarding.hooks";
import useOnboardingTnc from "../hooks/onboarding.tnc.hooks";

type TOnboardingTnc = {};

const OnboardingTnc = React.forwardRef<
  HTMLDivElement,
  TOnboardingTnc & BoxProps
>(({ ...props }, ref) => {
  const tButton = useTranslations("Button");
  const t = useTranslations("Onboarding.Tnc");
  const { onboardingData, saveOnboardingData, handleStep, mutation } =
    useOnboarding();
  const { form, viewport, scrollPosition, onScrollPositionChange } =
    useOnboardingTnc();

  React.useEffect(() => {
    if (onboardingData.tnc) {
      form.setValue("agreed", onboardingData.tnc);
    }
  }, [form, onboardingData]);

  return (
    <Box id="onboarding-company-info" {...props}>
      <h3 className="mt-0 mb-4 font-medium">{t("tnc_head")}</h3>
      <div className="p-4 rounded-md bg-slate-100 dark:bg-slate-800">
        <ScrollArea
          h="400"
          onScrollPositionChange={onScrollPositionChange}
          viewportRef={viewport}
        >
          <div dangerouslySetInnerHTML={{ __html: t.raw("tnc_content") }} />
        </ScrollArea>
      </div>
      <form
        noValidate
        onSubmit={form.handleSubmit((data) => {
          saveOnboardingData("tnc", data.agreed);
        })}
        className="flex flex-col gap-4 mt-8"
      >
        <Controller
          name="agreed"
          control={form.control}
          render={({ field: { onChange, value } }) => (
            <Checkbox
              disabled={
                scrollPosition.y !== (viewport.current?.scrollHeight ?? 0) - 400
              }
              label={t("tnc_checkbox")}
              checked={value}
              size="md"
              error={form.formState.errors.agreed?.message}
              onChange={onChange}
            />
          )}
        />

        <div className="flex justify-between mt-6">
          <Button
            leftSection={<i className="ti ti-arrow-left"></i>}
            type="button"
            variant="subtle"
            onClick={() => handleStep(1)}
          >
            {tButton("previous")}
          </Button>
          <Button
            leftSection={<i className="ti ti-check"></i>}
            type="submit"
            color="green"
            loading={mutation.isPending}
          >
            {tButton("done")}
          </Button>
        </div>
      </form>
    </Box>
  );
});

OnboardingTnc.displayName = "OnboardingTnc";

export default OnboardingTnc;
