import { Box, Button, Divider } from "@mui/material";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import { ControlledMenu, MenuItem, useHover } from "@szhsin/react-menu";
import { useRef, useState } from "react";

const Navbar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);
  const { anchorProps, hoverProps } = useHover(isOpen, setOpen);
  const navigate = useNavigate();

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Button component={Link} to="/" className={styles.link}>
          Home
        </Button>

        <Box
          ref={ref}
          {...anchorProps}
          onClick={() => navigate("/articles")}
          sx={{ cursor: "pointer" }}
        >
          Articles
        </Box>

        <ControlledMenu
          {...hoverProps}
          anchorRef={ref as React.RefObject<Element>}
          state={isOpen ? "open" : "closed"}
          onClose={() => setOpen(false)}
        >
          <MenuItem onClick={() => navigate("/latestNews")}>
            Latest News
          </MenuItem>
          <MenuItem onClick={() => navigate("/reviews")}>Reviews</MenuItem>
          <MenuItem onClick={() => navigate("/brands")}>Brands</MenuItem>
        </ControlledMenu>

        <Button component={Link} to="/about" className={styles.link}>
          About
        </Button>
        <Button component={Link} to="/contact" className={styles.link}>
          Contact
        </Button>
      </Box>

      <Divider />
    </Box>
  );
};

export default Navbar;
