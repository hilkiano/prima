import { Accordion, Box, BoxProps, Group, Text } from "@mantine/core";
import { IconLock, IconUser } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React from "react";
import ProfileBasicInformation from "./forms/ProfileBasicInformation";
import { useUserContext } from "@/lib/userProvider";

type TSettingsProfile = {
  name: string;
  icon: React.ReactNode;
  description: string;
  privilege: string;
  content: React.ReactNode;
};

const settingsProfileContents: TSettingsProfile[] = [
  {
    name: "basic_information",
    icon: <IconUser />,
    description: "basic_information_desc",
    privilege: "SETTING_PROFILE_BASIC_INFORMATION",
    content: <ProfileBasicInformation className="p-2 pb-6" />,
  },
  {
    name: "basic_security",
    icon: <IconLock />,
    description: "basic_security_desc",
    privilege: "SETTING_PROFILE_BASIC_SECURITY",
    content: <></>,
  },
];

const SettingsProfile = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const t = useTranslations("Settings");
    const {userData} = useUserContext();
    return (
      <Box {...props}>
        <Accordion chevronPosition="right" variant="separated">
          {settingsProfileContents.map((setting) => {
            return (
              <Accordion.Item value={setting.name} key={setting.name}>
                <Accordion.Control disabled={!userData?.privileges?.includes(setting.privilege)}>
                  <Group wrap="nowrap">
                    {setting.icon}
                    <div>
                      <Text>{t(`Profile.${setting.name}`)}</Text>
                      <Text size="sm" c="dimmed" fw={400}>
                        {t(`Profile.${setting.description}`)}
                      </Text>
                    </div>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>{setting.content}</Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Box>
    );
  }
);

SettingsProfile.displayName = "SettingsProfile";
export default SettingsProfile;
