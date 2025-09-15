import { Box, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <MenuItem onClick={() => navigate("/articleList")}>
          All Articles
        </MenuItem>
        <MenuItem onClick={() => navigate("/articleEditor")}>
          New Article
        </MenuItem>
        <MenuItem onClick={() => navigate("/brandList")}>All Brands</MenuItem>
        <MenuItem onClick={() => navigate("/brandEditor")}>New Brand</MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;
