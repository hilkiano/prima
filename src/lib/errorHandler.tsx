import { Code, ScrollArea } from "@mantine/core";
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
