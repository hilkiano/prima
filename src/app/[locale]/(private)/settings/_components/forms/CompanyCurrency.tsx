import CurrencySelector from "@/components/CurrencySelector";
import { Box, BoxProps, Button, Checkbox, Switch } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React from "react";
import useCompanyCurrency from "../../_hooks/company_currency.hooks";
import { useUserContext } from "@/lib/userProvider";

const CompanyCurrency = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const { mutation } = useCompanyCurrency();
    const tButton = useTranslations("Button");
    const t = useTranslations("Settings.Company");
    const [value, setValue] = React.useState<string | null>(null);
    const [isAlternate, setIsAlternate] = React.useState<boolean>(false);

    const { userData } = useUserContext();

    React.useEffect(() => {
      if (userData?.company.configs?.currency) {
        setValue(String(userData.company.configs.currency.id));
        setIsAlternate(userData.company.configs.currency.is_alternate);
      }
    }, [userData]);

    return (
      <Box {...props}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col xs:flex-row justify-between xs:items-center gap-2">
            <span className="text-sm font-bold">{t("currency")}</span>
            <CurrencySelector
              className="xs:max-w-[160px]"
              onChange={(val) => setValue(val)}
              radius="xl"
              value={value}
            />
          </div>
          <div className="flex flex-col xs:flex-row justify-between xs:items-center gap-2">
            <span className="text-sm font-bold">{t("label_alt_currency")}</span>
            <Checkbox
              size="md"
              disabled={!value}
              onChange={(val) => setIsAlternate(val.target.checked)}
              checked={isAlternate}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => {
                mutation.mutate({
                  class: "Company",
                  payload: {
                    payload: {
                      id: userData?.company.id,
                      configs: {
                        ...userData?.company.configs,
                        currency: {
                          id: parseInt(value!),
                          is_alternate: isAlternate,
                        },
                      },
                    },
                  },
                });
              }}
              variant="filled"
              leftSection={<IconCheck />}
              loading={mutation.isPending}
              disabled={!value}
              type="submit"
            >
              {tButton("save")}
            </Button>
          </div>
        </div>
      </Box>
    );
  }
);

CompanyCurrency.displayName = "CompanyCurrency";
export default CompanyCurrency;
