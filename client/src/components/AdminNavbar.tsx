import { useState } from "react";
import { Box, Button, Divider } from "@mui/material";
import styles from "../styles/Navbar.module.css";
import { LoginDialog } from "../components";
import { useAuth } from "../hooks";
import { UserMenu } from ".";

const AdminNavbar = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { isAuthenticated, username, logout } = useAuth();

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        {/* Left spacer */}
        <Box flex={1}>
          {isAuthenticated && (
            <UserMenu
              username={username ? "Logged in as: " + username : "User"}
            />
          )}
        </Box>

        {/* Right button */}
        <Box flex={1} display="flex" justifyContent="flex-end">
          {!isAuthenticated ? (
            <Button className={styles.link} onClick={handleOpen}>
              Editor Login
            </Button>
          ) : (
            <Button className={styles.link} onClick={logout}>
              Logout
            </Button>
          )}
        </Box>
      </Box>

      <Divider />

      {/* Modal */}
      <LoginDialog open={open} onClose={handleClose} />
    </Box>
  );
};

export default AdminNavbar;
