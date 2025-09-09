import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";

export function useRequireAuth(redirectTo = "/") {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.userToken === undefined) return; // still loading
    if (!auth.userToken) {
      navigate(redirectTo);
    }
    setLoading(false); // token ready
  }, [auth.userToken, navigate, redirectTo]);

  return { ...auth, userToken: auth.userToken, loading };
}
