import React, { createContext, useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import type { LoginResponse } from "../models";

export interface AuthData {
  isAuthenticated: boolean;
  userRole?: string;
  userID?: string;
  userToken?: string;
  username?: string;
  authorName?: string;
  loading?: boolean;
  logout: () => void;
  setUserCookies: (data: LoginResponse) => void;
}

const AuthContext = createContext<AuthData | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authData, setAuthData] = useState<
    Omit<AuthData, "logout" | "setUserCookies">
  >({
    isAuthenticated: false,
    userRole: undefined,
    userID: undefined,
    userToken: undefined,
    username: undefined,
    authorName: undefined,
  });

  const [loadingAuth, setLoadingAuth] = useState(true);

  const logout = useCallback(() => {
    ["token", "role", "id", "username", "authorName"].forEach((key) =>
      Cookies.remove(key)
    );
    setAuthData({
      isAuthenticated: false,
      userRole: undefined,
      userID: undefined,
      userToken: undefined,
      username: undefined,
      authorName: undefined,
    });
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        if (Date.now() >= exp * 1000) {
          logout();
        }
      } catch {
        logout();
      }
    }

    setAuthData({
      isAuthenticated: !!token,
      userRole: Cookies.get("role"),
      userID: Cookies.get("id"),
      userToken: token,
      username: Cookies.get("username"),
      authorName: Cookies.get("authorName"),
    });

    setLoadingAuth(false); // done checking cookies
  }, []);

  const setUserCookies = (data: LoginResponse) => {
    const { user: { role, id, username, authorName } = {}, token } = data;
    if ([role, id, username, authorName, token].some((v) => v === undefined)) {
      throw new Error("Missing required user info");
    }

    // store cookies for 7 days (matches JWT expiry)
    const cookieOptions = {
      expires: 7,
      sameSite: "None" as const,
      secure: true,
    };

    Cookies.set("token", token!, cookieOptions);
    Cookies.set("role", role!, cookieOptions);
    Cookies.set("id", id!, cookieOptions);
    Cookies.set("username", username!, cookieOptions);
    Cookies.set("authorName", authorName!, cookieOptions);

    setAuthData({
      isAuthenticated: true,
      userRole: role,
      userID: id,
      userToken: token,
      username,
      authorName,
    });
  };

  return (
    <AuthContext.Provider
      value={{ ...authData, logout, setUserCookies, loading: loadingAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
