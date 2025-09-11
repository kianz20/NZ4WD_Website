import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";

export function useRequireAuth(redirectTo = "/") {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.isAuthenticated === undefined) return;

    if (!auth.isAuthenticated || !auth.userToken) {
      navigate(redirectTo, { replace: true });
    }

    setLoading(false);
  }, [auth.isAuthenticated, auth.userToken, navigate, redirectTo]);

  return { ...auth, loading };
}
