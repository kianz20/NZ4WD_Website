import { Box, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "../constants/routes";

const UserMenu = ({ username }: { username: string }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  return (
    <Box flex={1} display="flex">
      <Box onClick={handleClick} sx={{ cursor: "pointer" }} minWidth="100px">
        {username}
      </Box>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => navigate(ADMIN_ROUTES.ARTICLE_LIST)}>
          All Articles
        </MenuItem>
        <MenuItem onClick={() => navigate(ADMIN_ROUTES.ARTICLE_EDITOR)}>
          New Article
        </MenuItem>
        <MenuItem onClick={() => navigate(ADMIN_ROUTES.BRAND_LIST)}>
          All Brands
        </MenuItem>
        <MenuItem onClick={() => navigate(ADMIN_ROUTES.BRAND_EDITOR)}>
          New Brand
        </MenuItem>
        <MenuItem onClick={() => navigate(ADMIN_ROUTES.DASHBOARD)}>
          Dashboard
        </MenuItem>
        <MenuItem onClick={() => navigate(ADMIN_ROUTES.MEDIA_LIBRARY)}>
          Media Library
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;
