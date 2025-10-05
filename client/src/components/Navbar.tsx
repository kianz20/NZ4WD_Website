import { Link } from "react-router-dom";
import { Box, Button, Divider } from "@mui/material";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        {/* Center buttons */}
        <Button component={Link} to="/" className={styles.link}>
          Home
        </Button>
        <Button component={Link} to="/articles" className={styles.link}>
          Articles
        </Button>
        <Button component={Link} to="/latestNews" className={styles.link}>
          Latest News
        </Button>
        <Button component={Link} to="/reviews" className={styles.link}>
          Reviews
        </Button>
        <Button component={Link} to="/brands" className={styles.link}>
          Brands
        </Button>
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
