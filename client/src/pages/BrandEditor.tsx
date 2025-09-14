import { Typography } from "@mui/material";
import { Header, HeadlineBanner, Navbar } from "../components";
const BrandEditor = () => {
  return (
    <>
      <Header />
      <Navbar />
      <HeadlineBanner />
      <Typography variant="h4" component="h1">
        Brand Editor
      </Typography>
    </>
  );
};

export default BrandEditor;
