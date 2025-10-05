/* eslint-disable react-hooks/exhaustive-deps */
import { Button, DialogActions, TextField, Typography } from "@mui/material";
import type { LoginResponse, LoginError, LoginBody } from "../../models";
import * as api from "../../api/userController";
import { useEffect, useState } from "react";
import { useAuth, useToast } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "../../constants/routes";

const Login = () => {
  const navigate = useNavigate();
  const { setUserCookies } = useAuth();
  const { showToast } = useToast();
  const { userToken } = useAuth();

  const [loginBody, setLoginBody] = useState<LoginBody>({
    username: "",
    password: "",
  });
  const [error, setError] = useState(false);

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginBody((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleLogin = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const data: LoginResponse = await api.loginUser(loginBody);
      setUserCookies(data);
      navigate(ADMIN_ROUTES.DASHBOARD);
    } catch (error: unknown) {
      const err = error as LoginError;
      console.error("Login failed:", err.message, "Status:", err.status);
      setError(true);
      if (err.status === 401) {
        showToast("Username or Password is incorrect", "error");
      }
    }
  };

  useEffect(() => {
    if (userToken) navigate(ADMIN_ROUTES.DASHBOARD);
  }, [userToken]);

  return (
    <>
      <Typography>NZ4WD Admin Login</Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Username"
          name="username"
          fullWidth
          margin="normal"
          required
          value={loginBody.username}
          onChange={handleFormChange}
          error={error}
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          fullWidth
          margin="normal"
          required
          value={loginBody.password}
          onChange={handleFormChange}
          error={error}
        />
        <DialogActions>
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

export default Login;
