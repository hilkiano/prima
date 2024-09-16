import CurrencySelector from "@/components/CurrencySelector";
import {
  Box,
  BoxProps,
  Button,
  Checkbox,
  Switch,
  useMantineTheme,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React from "react";
import { useUserContext } from "@/lib/userProvider";
import useOutletCurrency from "../../_hooks/outlet_currency.hooks";
import { useMediaQuery } from "@mantine/hooks";

const OutletCurrency = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const { mutation } = useOutletCurrency();
    const tButton = useTranslations("Button");
    const t = useTranslations("Settings.Outlet");
    const [value, setValue] = React.useState<string | null>(null);
    const [isAlternate, setIsAlternate] = React.useState<boolean>(false);
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

    const { userData } = useUserContext();

    React.useEffect(() => {
      if (userData?.outlet.configs?.currency) {
        setValue(String(userData.outlet.configs.currency.id));
        setIsAlternate(userData.outlet.configs.currency.is_alternate);
      }
    }, [userData]);

    return (
      <Box {...props}>
        <div className="flex flex-col gap-6 xs:gap-0">
          <div className="flex flex-col xs:flex-row justify-between xs:items-center gap-2 xs:hover:dark:bg-slate-800/40 xs:hover:bg-slate-300/40 xs:p-4 xs:rounded-lg">
            <span className="text-sm font-bold">{t("currency")}</span>
            <CurrencySelector
              className="xs:max-w-[160px]"
              onChange={(val) => setValue(val)}
              radius="xl"
              value={value}
            />
          </div>
          <div className="flex flex-row justify-between items-center gap-2 xs:hover:dark:bg-slate-800/40 xs:hover:bg-slate-300/40 xs:p-4 xs:rounded-lg">
            <span className="text-sm font-bold">{t("label_alt_currency")}</span>
            <Switch
              size={isMobile ? "sm" : "lg"}
              disabled={!value}
              onChange={(val) => setIsAlternate(val.target.checked)}
              checked={isAlternate}
              classNames={{
                root: "w-fit",
              }}
            />
          </div>
          <div className="flex justify-end mt-6">
            <Button
              onClick={() => {
                mutation.mutate({
                  class: "Outlet",
                  payload: {
                    payload: {
                      id: userData?.outlet.id,
                      configs: {
                        ...userData?.outlet.configs,
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
              className="w-full xs:w-auto"
            >
              {tButton("save")}
            </Button>
          </div>
        </div>
      </Box>
    );
  }
);

OutletCurrency.displayName = "OutletCurrency";
export default OutletCurrency;
