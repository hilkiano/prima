import { Button, Modal, ModalProps, Progress } from "@mantine/core";
import React from "react";

type TProgressDialog = {
  title?: string;
  value: number;
  body: React.ReactNode;
  isError: boolean;
  details?: React.ReactNode;
  closeFn: () => void;
  closeBtnText: string;
  closable?: boolean;
};

const ProgressDialog = React.forwardRef<
  HTMLDivElement,
  ModalProps & TProgressDialog
>(
  (
    {
      title,
      body,
      closeFn,
      closeBtnText,
      value,
      isError,
      details,
      closable,
      ...props
    },
    ref
  ) => {
    return (
      <Modal
        ref={ref}
        {...props}
        title={title ?? undefined}
        withCloseButton={false}
        centered
        closeOnClickOutside={closable ?? true}
        closeOnEscape={closable ?? true}
      >
        <div className="flex flex-col gap-2 items-center">
          {body}
          <Progress.Root className="w-full" size="xl" radius="xl">
            <Progress.Section
              value={value}
              color={value === 100 ? "green" : isError ? "red" : "blue"}
              animated={value === 100 ? false : true}
            >
              <Progress.Label className="text-lg">{value}%</Progress.Label>
            </Progress.Section>
          </Progress.Root>
          <Button
            variant="filled"
            disabled={closable === false ? value !== 100 : false}
            className="mt-6 self-end"
            onClick={closeFn}
          >
            {closeBtnText}
          </Button>
        </div>
      </Modal>
    );
  }
);

ProgressDialog.displayName = "ProgressDialog";
export default ProgressDialog;
