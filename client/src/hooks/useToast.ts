import { useContext } from "react";
import { type ToastData, ToastContext } from "../contexts";

export const useToast = (): ToastData => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
