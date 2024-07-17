import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import React from "react";

/**
 * Show Error to UI depends from the error code.
 *
 * @param title
 * @param error
 */
export const showError = (
  errorMessageBag: AlertMessage,
  error: JsonResponse<null>
) => {
  if (error.statusCode !== 500) {
    notifications.show({
      color: "yellow",
      title: errorMessageBag.notification_message_bag.alert_title,
      message: error.message,
    });
  } else {
  }
};
