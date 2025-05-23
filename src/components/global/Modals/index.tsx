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
import ConditionalWrapper from "../ConditionalWrapper";

export type IModalProps = {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  description?: string;
  title: string;
  children?: React.ReactNode;
  confirmButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  closeOnClickOutside?: boolean;
  showActions?: boolean;
};

const Modal = ({
  modalOpen,
  setModalOpen,
  description,
  title,
  children,
  confirmButtonProps,
  cancelButtonProps,
  closeOnClickOutside = true,
  showActions = true,
}: IModalProps) => {
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen} modal={true}>
      <DialogContent
        onPointerDownOutside={(e) => {
          if (!closeOnClickOutside) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <div className="mt-4 flex flex-col gap-y-4">
            <div>{children}</div>
          </div>
        </DialogHeader>
        <ConditionalWrapper show={showActions}>
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
              variant="destructive"
              onClick={(e) => confirmButtonProps?.onClick?.(e)}
            >
              Confirm
            </Button>
          </DialogFooter>
        </ConditionalWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
