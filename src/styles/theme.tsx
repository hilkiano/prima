"use client";

import {
  PasswordInput,
  Select,
  TextInput,
  Notification,
  createTheme,
  AppShell,
  Modal,
  Button,
  Menu,
} from "@mantine/core";
import classes from "@/styles/components.module.css";
import { IconSquareRoundedXFilled } from "@tabler/icons-react";

export const theme = createTheme({
  activeClassName: classes.active,
  colors: {
    slate: [
      "#f8fafc",
      "#f1f5f9",
      "#e2e8f0",
      "#cbd5e1",
      "#94a3b8",
      "#64748b",
      "#475569",
      "#334155",
      "#1e293b",
      "#0f172a",
      "#020617",
    ],
  },
  components: {
    Select: Select.extend({
      classNames: {
        input: classes.selectInput,
        dropdown: classes.selectDropdown,
        option: classes.selectOption,
      },
      defaultProps: {
        checkIconPosition: "right",
        withScrollArea: false,
      },
    }),
    Button: Button.extend({
      classNames: {
        root: classes.buttonRoot,
      },
    }),
    TextInput: TextInput.extend({
      classNames: {
        input: classes.textInputInput,
        error: classes.textInputError,
      },
      defaultProps: {
        variant: "filled",
      },
    }),
    PasswordInput: PasswordInput.extend({
      classNames: {
        innerInput: "font-sans",
        input: classes.passwordInputInput,
        error: classes.passwordInputError,
      },
    }),
    Menu: Menu.extend({
      classNames: {
        dropdown: classes.menuDropdown,
        item: classes.menuItem,
        divider: classes.menuDivider,
      },
    }),
    Notification: Notification.extend({
      defaultProps: {
        radius: "lg",
        withCloseButton: false,
      },
      classNames: {
        root: "!bg-black",
      },
    }),
    AppShell: AppShell.extend({
      defaultProps: {
        styles: {
          navbar: {
            backdropFilter: "blur(30px)",
          },
        },
      },
    }),
    Modal: Modal.extend({
      defaultProps: {
        overlayProps: {
          backgroundOpacity: 0.2,
          blur: 20,
        },
        closeButtonProps: {
          icon: (
            <IconSquareRoundedXFilled
              width={50}
              height={50}
              className="opacity-75"
            />
          ),
        },
        transitionProps: {
          transition: "fade",
          duration: 250,
        },
      },
      classNames: {
        content: classes.modalContent,
        header: classes.modalHeader,
        title: classes.modalTitle,
        close: classes.modalClose,
      },
    }),
  },
});
