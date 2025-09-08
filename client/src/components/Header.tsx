import { Box } from "@mui/material";
import Logo from "../assets/NZ4WD-logo.gif";

const Header = () => {
  return (
    <Box display="flex" justifyContent="center" width="100%">
      <Box component="img" src={Logo} />
    </Box>
  );
};

export default Header;
