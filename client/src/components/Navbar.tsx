import { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Divider } from "@mui/material";
import styles from "../styles/Navbar.module.css";
import LoginDialog from "./LoginDialog";
import { useAuth } from "../hooks";
import { UserMenu } from ".";

const Navbar = () => {
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

        {/* Center buttons */}
        <Box display="flex" gap={2}>
          <Button component={Link} to="/" className={styles.link}>
            Home
          </Button>
          <Button component={Link} to="/latestNews" className={styles.link}>
            Latest News
          </Button>
          <Button component={Link} to="/articles" className={styles.link}>
            Articles
          </Button>
          <Button component={Link} to="/reviews" className={styles.link}>
            Reviews
          </Button>
          <Button component={Link} to="/brands" className={styles.link}>
            Brands
          </Button>
          <Button component={Link} to="/aboutUs" className={styles.link}>
            About
          </Button>
          <Button component={Link} to="/contactUs" className={styles.link}>
            Contact
          </Button>
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

export default Navbar;
