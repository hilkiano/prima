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
  Textarea,
  Checkbox,
  Code,
  ScrollArea,
} from "@mantine/core";
import classes from "@/styles/components.module.css";
import { IconSquareRoundedXFilled } from "@tabler/icons-react";

export const theme = createTheme({
  activeClassName: classes.active,
  defaultGradient: { from: "blue", to: "cyan", deg: 145 },
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
        error: classes.textInputError,
      },
      defaultProps: {
        checkIconPosition: "right",
        withScrollArea: false,
        variant: "filled",
      },
    }),
    Button: Button.extend({
      classNames: {
        root: classes.buttonRoot,
      },
      defaultProps: {
        radius: "xl",
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
    Textarea: Textarea.extend({
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
    Checkbox: Checkbox.extend({
      classNames: {
        input: classes.checkboxInput,
        error: classes.textInputError,
      },
      defaultProps: {
        radius: "xl",
      },
    }),
    Code: Code.extend({
      classNames: {
        root: classes.codeRoot,
      },
    }),
    ScrollArea: ScrollArea.extend({
      classNames: {
        scrollbar: classes.scrollAreaScrollBar,
      },
    }),
  },
});
