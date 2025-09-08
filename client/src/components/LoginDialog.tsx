import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import type { LoginBody, LoginResponse } from "../models";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api/userController";
import { useAuth } from "../hooks";

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

const LoginDialog = ({ open, onClose }: LoginDialogProps) => {
  const { setUserCookies } = useAuth();

  const [loginBody, setLoginBody] = useState<LoginBody>({
    username: "",
    password: "",
  });

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginBody((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleLogin = async (event: { preventDefault: () => void }) => {
    try {
      event.preventDefault();
      const data: LoginResponse = await api.loginUser(loginBody);
      if (data.error) {
        console.error("Login failed: ", data.error);
      } else {
        setUserCookies(data);
        // Navigate to the home page after successful login
        navigate("/");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
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
          />
          <DialogActions>
            <Button type="button" onClick={onClose}>
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
