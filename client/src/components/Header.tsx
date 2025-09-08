import { Box } from "@mui/material";
import Logo from "../assets/NZ4WD-logo.gif";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <Box display="flex" justifyContent="center" width="100%">
      <Box
        component="img"
        src={Logo}
        onClick={() => navigate("/")}
        sx={{ cursor: "pointer" }}
      />
    </Box>
  );
};

export default Header;
