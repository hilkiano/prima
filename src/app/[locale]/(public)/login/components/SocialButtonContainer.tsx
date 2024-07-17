import SocialButton from "@/components/SocialButton";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

function SocialButtonContainer() {
  const t = useTranslations("Button");
  return (
    <>
      <SocialButton
        variant="default"
        radius="xl"
        component={Link}
        href={`${process.env.NEXT_PUBLIC_WEB_URL}auth/google`}
        type="google"
      >
        {t("google")}
      </SocialButton>
    </>
  );
}

export default SocialButtonContainer;
