import { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";

type MenuItemData = {
  label: string;
  path: string;
};

type NavMenuProps = {
  label: string;
  items: MenuItemData[];
};

const NavMenu = ({ label, items }: NavMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (path: string) => {
    navigate(path);
    handleClose();
  };

  return (
    <>
      <Button className={styles.link} onClick={handleOpen}>
        {label}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {items.map((item) => (
          <MenuItem key={item.path} onClick={() => handleItemClick(item.path)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NavMenu;
