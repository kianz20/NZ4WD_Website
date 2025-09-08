import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { type LoginResponse } from "../models";

interface AuthData {
  isAuthenticated: boolean;
  userRole: string | undefined;
  userID: string | undefined;
  userToken: string | undefined;
  username: string | undefined;
  logout: () => void;
  setUserCookies: (data: LoginResponse) => void;
}

const setCookie = (name: string, value: string) => {
  Cookies.set(name, value, {
    expires: 1,
    sameSite: "None",
    secure: true,
  });
};

export const useAuth = (): AuthData => {
  const [authData, setAuthData] = useState<{
    isAuthenticated: boolean;
    userRole: string | undefined;
    userID: string | undefined;
    userToken: string | undefined;
    username: string | undefined;
  }>({
    isAuthenticated: false,
    userRole: undefined,
    userID: undefined,
    userToken: undefined,
    username: undefined,
  });

  useEffect(() => {
    const token = Cookies.get("token");
    const isAuthenticated = !!token;

    setAuthData({
      isAuthenticated,
      userRole: Cookies.get("role"),
      userID: Cookies.get("id"),
      userToken: token,
      username: Cookies.get("username"),
    });
  }, []);

  const logout = useCallback(() => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("id");
    Cookies.remove("username");
    setAuthData({
      isAuthenticated: false,
      userRole: undefined,
      userID: undefined,
      userToken: undefined,
      username: undefined,
    });
  }, []);

  const setUserCookies = (data: LoginResponse): void => {
    const { user: { role, id, username } = {}, token } = data;
    // Validate that none of the required values are undefined
    if ([role, id, username, token].some((value) => value === undefined)) {
      throw new Error("Missing required user information or token.");
    }
    setCookie("token", token as string);
    setCookie("role", role as string);
    setCookie("id", id as string);
    setCookie("username", username as string);
  };

  return { ...authData, logout, setUserCookies };
};
