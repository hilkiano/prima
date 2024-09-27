import { useState } from "react";
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { Link, usePathname } from "@/lib/navigation";
import { IconChevronRight } from "@tabler/icons-react";
import classes from "../styles/NavbarLinksGroup.module.css";
import { useTranslations } from "next-intl";
import { useUserContext } from "@/lib/userProvider";
import { NavbarLinks } from "@/types/common.types";

export function NavbarLink({
  icon,
  label,
  initiallyOpened,
  link,
  links,
  onClick,
}: NavbarLinks) {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const hasLinks = Array.isArray(links);
  // TODO: Create navbar state and save into database per user each time they open a sidebar.
  const [opened, setOpened] = useState(initiallyOpened || false);
  const { userData } = useUserContext();

  const filteredLinks = links
    ? links.filter(
        (link) =>
          !link.privilege || userData?.privileges?.includes(link.privilege!)
      )
    : [];

  const items = (hasLinks ? filteredLinks : []).map((link) => (
    <Link
      data-active={pathname === link.link}
      className={classes.link}
      href={link.link}
      key={link.label}
      onClick={onClick}
    >
      {t(link.label)}
    </Link>
  ));

  return (
    <>
      <UnstyledButton
        component={link ? Link : undefined}
        href={link ? link : ""}
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
        data-active={pathname === link}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: "flex", alignItems: "start" }}>
            <ThemeIcon variant="light" size={30}>
              <i className={`ti ti-${icon} text-lg`}></i>
            </ThemeIcon>
            <Box ml="md" className="flex flex-wrap mt-1">
              {t(label)}
            </Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? "rotate(-90deg)" : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
