
import { useState, useCallback } from "react";

type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = useCallback(({
    title,
    description,
    action,
    variant = "default",
  }: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).slice(2, 11);
    
    setToasts((toasts) => [
      ...toasts,
      { id, title, description, action, variant },
    ]);

    return {
      id,
      dismiss: () => dismissToast(id),
      update: (props: Omit<ToastProps, "id">) => updateToast(id, props),
    };
  }, []);

  function dismissToast(id: string) {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  function updateToast(id: string, props: Omit<ToastProps, "id">) {
    setToasts((toasts) =>
      toasts.map((toast) =>
        toast.id === id ? { ...toast, ...props } : toast
      )
    );
  }

  return {
    toasts,
    toast,
    dismissToast,
  };
}

// Create a toast function that can be used without the hook
// Using a new approach that doesn't cause the "useState" outside of component error
let toastFn: (props: Omit<ToastProps, "id">) => {
  id: string;
  dismiss: () => void;
  update: (props: Omit<ToastProps, "id">) => void;
};

// This is a mutable object we can use to store our toast handler
const handlers = {
  toast: (props: Omit<ToastProps, "id">) => {
    if (!toastFn) {
      console.warn(
        "Toast handler not mounted. Toast messages won't appear until the <Toaster /> component is mounted."
      );
      return {
        id: "dummy-id",
        dismiss: () => {},
        update: () => {},
      };
    }
    return toastFn(props);
  },
};

// This gets called inside the Toaster component
export function setToastHandler(fn: typeof toastFn) {
  toastFn = fn;
}

export const toast = handlers.toast;
