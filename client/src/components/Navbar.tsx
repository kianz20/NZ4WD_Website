import { Link } from "react-router-dom";
import { Box, Button, Divider } from "@mui/material";

const Navbar = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="center" gap={2}>
        <Button component={Link} to="/">
          Home
        </Button>
        <Button component={Link} to="/latestNews">
          Latest News
        </Button>
        <Button component={Link} to="/articles">
          Articles
        </Button>
        <Button component={Link} to="/reviews">
          Reviews
        </Button>
        <Button component={Link} to="/brands">
          Brands
        </Button>
        <Button component={Link} to="/aboutUs">
          About
        </Button>
        <Button component={Link} to="/contactUs">
          Contact
        </Button>
      </Box>
      <Divider />
    </Box>
  );
};

export default Navbar;
