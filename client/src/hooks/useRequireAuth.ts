import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";

export function useRequireAuth(redirectTo = "/") {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.loading) return; // wait for AuthProvider to finish

    if (!auth.isAuthenticated || !auth.userToken) {
      navigate(redirectTo, { replace: true });
    }
  }, [
    auth.loading,
    auth.isAuthenticated,
    auth.userToken,
    navigate,
    redirectTo,
  ]);

  // Return loading from auth instead of an undefined variable
  return { ...auth, loading: auth.loading };
}
