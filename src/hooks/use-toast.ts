
import { useState, useEffect } from "react";
import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

// Define the shape of toast props we'll store
export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// Define an empty function as a placeholder for toast
let toastFunction: (props: Omit<ToasterToast, "id">) => void = () => {};

// This function will be called by the Toaster component to set the toastFunction
export function setToastHandler(fn: (props: Omit<ToasterToast, "id">) => void) {
  toastFunction = fn;
}

// The actual toast function that can be imported and used anywhere
export function toast(props: Omit<ToasterToast, "id">) {
  toastFunction(props);
}

// The useToast hook to be used within React components
export const useToast = () => {
  const [toasts, setToasts] = useState<ToasterToast[]>([]);

  const addToast = ({ ...props }: Omit<ToasterToast, "id">) => {
    // Create a unique id for this toast
    const id = Math.random().toString(36).substring(2, 9);
    
    // Add the toast to state
    setToasts((prev) => [...prev, { id, ...props }]);
    
    // Return the toast id
    return id;
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Register the toast function when the component using this hook mounts
  useEffect(() => {
    setToastHandler(addToast);
    return () => setToastHandler(() => {});
  }, []);

  return {
    toasts,
    toast: addToast,
    dismissToast,
  };
};
