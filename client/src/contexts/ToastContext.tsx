import React, { createContext, useState, type ReactNode } from "react";
import { Snackbar, Alert } from "@mui/material";

export interface ToastData {
  showToast: (
    message: string,
    severity?: "success" | "error" | "info" | "warning",
    hideDuration?: number
  ) => void;
}

const ToastContext = createContext<ToastData | undefined>(undefined);

const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState(3000);
  const [severity, setSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const showToast = (
    msg: string,
    sev: "success" | "error" | "info" | "warning" = "info",
    dur: number = 3000
  ) => {
    setOpen(false);
    setMessage(msg);
    setDuration(dur);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export { ToastProvider, ToastContext };
