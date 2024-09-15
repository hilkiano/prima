import { useUserContext } from "@/lib/userProvider";
import { Accordion, Box, BoxProps, Group, Text } from "@mantine/core";
import { IconBuildings, IconCash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React from "react";
import CompanyBasicInformation from "./forms/CompanyBasicInformation";
import CompanyCurrency from "./forms/CompanyCurrency";

type TSettingsCompany = {
  name: string;
  icon: React.ReactNode;
  description: string;
  privilege: string;
  content: React.ReactNode;
};

const settingsCompanyContents: TSettingsCompany[] = [
  {
    name: "basic_information",
    icon: <IconBuildings />,
    description: "basic_information_desc",
    privilege: "SETTING_COMPANY_BASIC_INFORMATION",
    content: <CompanyBasicInformation className="w-full p-2 pb-6" />,
  },
  {
    name: "currency",
    icon: <IconCash />,
    description: "currency_desc",
    privilege: "SETTING_COMPANY_CURRENCY",
    content: <CompanyCurrency className="w-full p-2 pb-6" />,
  },
];

const SettingsCompany = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const t = useTranslations("Settings");
    const { userData } = useUserContext();

    return (
      <Box {...props}>
        <Accordion chevronPosition="right" variant="separated">
          {settingsCompanyContents
            .filter((setting) =>
              userData?.privileges.includes(setting.privilege)
            )
            .map((setting) => (
              <Accordion.Item value={setting.name} key={setting.name}>
                <Accordion.Control>
                  <Group wrap="nowrap">
                    {setting.icon}
                    <div>
                      <Text>{t(`Company.${setting.name}`)}</Text>
                      <Text size="sm" c="dimmed" fw={400}>
                        {t(`Company.${setting.description}`)}
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

SettingsCompany.displayName = "SettingsCompany";
export default SettingsCompany;
