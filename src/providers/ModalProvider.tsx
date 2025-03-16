import Modal, { IModalProps } from "@/components/global/Modals/Modal";
import React, { createContext, useContext, useState, ReactNode } from "react";

/**
 * useModal provides an easy way to trigger modals that require user confirmation.
 * ---------------------------------------------------------------------------------------------------------
 * This hook is best used for scenarios where you need a confirmation dialog before
 * performing an action, such as form submission or deletion. It allows you to centralize
 * the logic for triggering and handling modals, without having to pass modal props
 * down through the component tree.
 * ---------------------------------------------------------------------------------------------------------
 * When to use:
 * - When you need to display a confirmation dialog before executing a critical action.
 * - When you want to centralize the modal logic in a single context for easier management.
 * - When you need a quick and consistent way to show modals across different parts of your app.
 * ---------------------------------------------------------------------------------------------------------
 * When not to use:
 * - Do not use this for general-purpose modals that are tied to specific UI elements or components.
 * - Do not use this to replace modals that have complex interactions or stateful content.
 * - Do not use this for modals that require passing dynamic content or props from multiple components.
 * ---------------------------------------------------------------------------------------------------------
 * Example usage:
 * ---------------------------------------------------------------------------------------------------------
 * const { confirm, close } = useModal();
 * confirm({
 *   title: 'Confirm Deletion',
 *   children: <p>Are you sure you want to delete this item?</p>,
 *   confirmButtonProps: {
 *     children: 'Delete',
 *     onClick: () => {
 *       // Perform some critical action here if you are feeling lucky
 *       close(); // Manually close the modal after the action is complete
 *     },
 *   },
 * });
 * ---------------------------------------------------------------------------------------------------------
 */

export type IConfirmModalProps = Omit<IModalProps, "show" | "onClose">;

interface ModalContextType {
  confirm: (modalProps: IConfirmModalProps) => void;
  close: () => void;
}

// Context to hold the modal functions.
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Provider to wrap around the app or parts of the app where modal triggering is needed.
export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [modalProps, setModalProps] = useState<IModalProps | null>(null);

  const confirm = (props: IModalProps) => {
    setModalProps(props);
  };

  const close = () => {
    setModalProps(null);
  };

  return (
    <ModalContext.Provider value={{ confirm, close }}>
      {children}
      {modalProps && (
        <Modal
          {...modalProps}
          modalOpen={!!modalProps}
          setModalOpen={close}
          cancelButtonProps={{
            ...modalProps.cancelButtonProps,
            onClick: (e) => {
              modalProps?.cancelButtonProps?.onClick?.(e);
              close();
            },
          }}
        />
      )}
    </ModalContext.Provider>
  );
};

// Custom hook for using the modal context
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
