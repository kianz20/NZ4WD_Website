import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <Box>
      <Link to="/">Home</Link>
      <Link to="/AboutUs">About</Link>
      <Link to="/ContactUs">Contact</Link>
    </Box>
  );
};

export default Navbar;
