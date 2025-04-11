
import { useState } from "react";

type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  function toast({
    title,
    description,
    action,
    variant = "default",
  }: Omit<ToastProps, "id">) {
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
  }

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

export { toast } from "./use-toast";
