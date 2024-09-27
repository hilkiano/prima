import { AlertMessage, JsonResponse } from "@/types/common.types";
import { Code, DefaultMantineColor, ScrollArea } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import React from "react";

/**
 * Show Error to UI depends from the error code.
 *
 * @param error
 */
export const showError = (
  errorMessageBag: AlertMessage,
  error: JsonResponse<null>
) => {
  if (error.code !== 500) {
    notifications.show({
      color: "yellow",
      title: errorMessageBag.notification_message_bag.alert_title,
      message: error.message,
    });
  } else {
    modals.open({
      centered: true,
      size: "xl",
      title: errorMessageBag.notification_message_bag.critical_title,
      styles: {
        title: {
          color: "red",
        },
      },
      children: (
        <div className="grid grid-cols-1 gap-2">
          <p className="font-medium my-0">{error.message}</p>
          {error.trace && (
            <ScrollArea h={300}>
              <Code block>{error.trace}</Code>
            </ScrollArea>
          )}
        </div>
      ),
    });
  }
};

export const showSuccess = (
  messageBag: AlertMessage,
  message: string | null
) => {
  notifications.show({
    color: "green",
    title: messageBag.saved,
    message: message,
  });
};

export const showNotification = (
  color: DefaultMantineColor,
  title: React.ReactNode,
  message: React.ReactNode,
  image?: React.ReactNode
) => {
  notifications.show({
    color: color,
    title: title,
    message: image ? (
      <div className="flex flex-row gap-2 mt-2">
        <div className="shrink-0">{image}</div>
        <div>{message}</div>
      </div>
    ) : (
      message
    ),
  });
};
