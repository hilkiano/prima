import { Modal, ModalProps } from "@mantine/core";
import React from "react";

type TConfirmationDialog = {
  content: React.ReactNode;
  positiveBtn: React.ReactNode;
  negativeBtn: React.ReactNode;
};

const ConfirmationDialog = React.forwardRef<
  HTMLDivElement,
  TConfirmationDialog & ModalProps
>(({ content, positiveBtn, negativeBtn, ...props }, ref) => {
  return (
    <Modal {...props}>
      <div className="flex flex-col gap-4">
        {content}
        <div className="flex gap-2 justify-end">
          {negativeBtn}
          {positiveBtn}
        </div>
      </div>
    </Modal>
  );
});

ConfirmationDialog.displayName = "ConfirmationDialog";
export default ConfirmationDialog;
