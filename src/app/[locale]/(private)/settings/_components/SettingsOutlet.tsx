import { useUserContext } from "@/lib/userProvider";
import { Accordion, Box, BoxProps, Group, Text } from "@mantine/core";
import {
  IconBuildings,
  IconBuildingStore,
  IconCash,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React from "react";
import OutletCurrency from "./forms/OutletCurrency";
import OutletBasicInformation from "./forms/OutletBasicInformation";

type TSettingsOutlet = {
  name: string;
  icon: React.ReactNode;
  description: string;
  privilege: string;
  content: React.ReactNode;
};

const settingsOutletContents: TSettingsOutlet[] = [
  {
    name: "basic_information",
    icon: <IconBuildingStore />,
    description: "basic_information_desc",
    privilege: "SETTING_OUTLET_BASIC_INFORMATION",
    content: <OutletBasicInformation className="p-2 pb-6" />,
  },
  {
    name: "currency",
    icon: <IconCash />,
    description: "currency_desc",
    privilege: "SETTING_OUTLET_CURRENCY",
    content: <OutletCurrency className="p-2 pb-6" />,
  },
];

const SettingsOutlet = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const t = useTranslations("Settings");
    const { userData } = useUserContext();

    return (
      <Box {...props}>
        <Accordion chevronPosition="right" variant="separated">
          {settingsOutletContents
            .filter((setting) =>
              userData?.privileges.includes(setting.privilege)
            )
            .map((setting) => (
              <Accordion.Item value={setting.name} key={setting.name}>
                <Accordion.Control>
                  <Group wrap="nowrap">
                    {setting.icon}
                    <div>
                      <Text>{t(`Outlet.${setting.name}`)}</Text>
                      <Text size="sm" c="dimmed" fw={400}>
                        {t(`Outlet.${setting.description}`)}
                      </Text>
                    </div>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>{setting.content}</Accordion.Panel>
              </Accordion.Item>
            ))}
        </Accordion>
      </Box>
    );
  }
);

SettingsOutlet.displayName = "SettingsOutlet";
export default SettingsOutlet;
