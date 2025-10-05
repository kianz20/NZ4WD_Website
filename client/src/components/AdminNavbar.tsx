// AdminNavbar.tsx (Refactored)
import { useState } from "react";
import { Box, Button, Divider } from "@mui/material";
import styles from "../styles/Navbar.module.css";
import { LoginDialog } from "../components";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "../constants/routes";
import NavMenu from "./NavMenu";

const articleMenuItems = [
  { label: "All Articles", path: ADMIN_ROUTES.ARTICLE_LIST },
  { label: "New Article", path: ADMIN_ROUTES.ARTICLE_EDITOR },
];

const brandMenuItems = [
  { label: "All Brands", path: ADMIN_ROUTES.BRAND_LIST },
  { label: "New Brand", path: ADMIN_ROUTES.BRAND_EDITOR },
];

const AdminNavbar = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        {/* Left side */}
        <Box display="flex" gap={2}>
          {isAuthenticated && (
            <>
              <NavMenu label="Articles" items={articleMenuItems} />
              <NavMenu label="Categories" items={brandMenuItems} />
              <Button
                className={styles.link}
                onClick={() => navigate(ADMIN_ROUTES.DASHBOARD)}
              >
                Dashboard
              </Button>
              <Button
                className={styles.link}
                onClick={() => navigate(ADMIN_ROUTES.MEDIA_LIBRARY)}
              >
                Media Library
              </Button>
            </>
          )}
        </Box>

        {/* Right side */}
        <Box display="flex" alignItems="center" gap={2}>
          {isAuthenticated ? (
            <>
              <Box>Logged in as: {username || "User"}</Box>
              <Button className={styles.link} onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Button className={styles.link} onClick={() => setOpenLogin(true)}>
              Editor Login
            </Button>
          )}
        </Box>
      </Box>

      <Divider />
      <LoginDialog open={openLogin} onClose={() => setOpenLogin(false)} />
    </Box>
  );
};

export default AdminNavbar;
