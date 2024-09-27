import { Button, Modal, ModalProps, Progress } from "@mantine/core";
import React from "react";

type TProgressDialog = {
  title?: string;
  value: number;
  body: React.ReactNode;
  closeFn: () => void;
  closeBtnText: string;
};

const ProgressDialog = React.forwardRef<
  HTMLDivElement,
  ModalProps & TProgressDialog
>(({ title, body, closeFn, closeBtnText, value, ...props }, ref) => {
  return (
    <Modal
      ref={ref}
      {...props}
      title={title ?? undefined}
      withCloseButton={false}
      centered
    >
      <div className="flex flex-col gap-2 items-center">
        {body}
        <Progress.Root className="w-full" size="xl" radius="xl">
          <Progress.Section
            value={value}
            color={value === 100 ? "green" : "blue"}
            animated={value === 100 ? false : true}
          >
            <Progress.Label className="text-lg">{value}%</Progress.Label>
          </Progress.Section>
        </Progress.Root>
        <Button className="mt-4" fullWidth onClick={closeFn}>
          {closeBtnText}
        </Button>
      </div>
    </Modal>
  );
});

ProgressDialog.displayName = "ProgressDialog";
export default ProgressDialog;
