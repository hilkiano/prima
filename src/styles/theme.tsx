"use client";

import {
  PasswordInput,
  Select,
  TextInput,
  Notification,
  createTheme,
  AppShell,
  Modal,
} from "@mantine/core";
import classes from "@/styles/components.module.css";
import { IconSquareRoundedXFilled } from "@tabler/icons-react";

export const theme = createTheme({
  activeClassName: classes.active,
  components: {
    Select: Select.extend({
      classNames: {
        input: "font-sans",
      },
      defaultProps: {
        checkIconPosition: "right",
      },
    }),
    TextInput: TextInput.extend({
      classNames: {
        input: "font-sans",
      },
    }),
    PasswordInput: PasswordInput.extend({
      classNames: {
        innerInput: "font-sans",
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
        title: classes.modalTitle,
        close: classes.modalClose,
      },
    }),
  },
});
