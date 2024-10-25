import { Box, BoxProps } from "@mantine/core";
import { useLocale, useTranslations } from "next-intl";
import React, { forwardRef } from "react";

const ImportGuide = forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const t = useTranslations("Products.Import");
    const locale = useLocale();

    return (
      <Box {...props}>
        <div className="flex flex-col gap-2">
          <div className="rounded-lg dark:bg-slate-700/50 bg-slate-300/50 p-4">
            <h1 className="m-0 font-semibold text-2xl">
              ⚠️ {t("guide_caution")}
            </h1>
            <ul className="text-xl">
              <li>
                {t.rich("rules_1", {
                  emp: (chunks) => <span className="font-black">{chunks}</span>,
                })}
              </li>
              <li>
                {t.rich("rules_2", {
                  emp: (chunks) => <span className="font-black">{chunks}</span>,
                })}
              </li>
              <li>
                {t.rich("rules_3", {
                  emp: (chunks) => <span className="font-black">{chunks}</span>,
                })}
              </li>
              <li>
                {t.rich("rules_4", {
                  emp: (chunks) => <span className="font-black">{chunks}</span>,
                  max: Intl.NumberFormat(locale).format(2000),
                })}
              </li>
            </ul>
          </div>
        </div>
      </Box>
    );
  }
);

ImportGuide.displayName = "ImportGuide";
export default ImportGuide;
