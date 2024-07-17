"use client";

import {
  ActionIcon,
  ActionIconProps,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import React from "react";

type TThemeToggle = {};

const ThemeToggle = React.forwardRef<
  HTMLDivElement,
  TThemeToggle & ActionIconProps
>(({ ...props }, ref) => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      variant="subtle"
      radius="xl"
      size="xs"
      aria-label="Toggle color scheme"
      {...props}
    >
      <i className="ti ti-sun text-lg light"></i>
      <i className="ti ti-moon text-lg dark"></i>
    </ActionIcon>
  );
});

ThemeToggle.displayName = "ThemeToggle";

export default ThemeToggle;
