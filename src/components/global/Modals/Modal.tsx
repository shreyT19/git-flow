import React from "react";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button, ButtonProps } from "@/components/ui/button";

export type IModalProps = {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  description: string;
  title: string;
  children: React.ReactNode;
  confirmButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
};

const Modal = ({
  modalOpen,
  setModalOpen,
  description,
  title,
  children,
  confirmButtonProps,
  cancelButtonProps,
}: IModalProps) => {
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <div className="mt-4 flex flex-col gap-y-4">
            <div>{children}</div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            {...cancelButtonProps}
            variant="outline"
            onClick={(e) => {
              cancelButtonProps?.onClick?.(e);
              setModalOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            {...confirmButtonProps}
            variant="outline"
            onClick={(e) => confirmButtonProps?.onClick?.(e)}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
