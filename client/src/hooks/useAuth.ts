import { useContext } from "react";
import { AuthContext, type AuthData } from "../contexts";

export const useAuth = (): AuthData => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
