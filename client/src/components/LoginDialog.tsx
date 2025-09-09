import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import type { LoginBody, LoginError, LoginResponse } from "../models";
import { useState } from "react";
import * as api from "../api/userController";
import { useAuth, useToast } from "../hooks";

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

const LoginDialog = ({ open, onClose }: LoginDialogProps) => {
  const { setUserCookies } = useAuth();
  const { showToast } = useToast();

  const [loginBody, setLoginBody] = useState<LoginBody>({
    username: "",
    password: "",
  });

  const [error, setError] = useState(false);

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginBody((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const data: LoginResponse = await api.loginUser(loginBody);
      setUserCookies(data);
      handleClose();
    } catch (error: unknown) {
      const err = error as LoginError;
      console.error("Login failed:", err.message, "Status:", err.status);
      setError(true);
      if (err.status === 401) {
        showToast("Username or Password is incorrect", "error");
      }
    }
  };

  const handleClose = () => {
    setError(false);
    setLoginBody({ username: "", password: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Editor Login</DialogTitle>
      <DialogContent>
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
            <Button type="button" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
