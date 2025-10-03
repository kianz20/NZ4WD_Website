import { Typography } from "@mui/material";
import { Header, HeadlineBanner, Navbar } from "../components";
import { useRequireAuth } from "../hooks";

const MediaLibrary = () => {
  useRequireAuth();
  return (
    <>
      <Header />
      <Navbar />
      <HeadlineBanner />
      <Typography variant="h4" component="h1">
        Media Library
      </Typography>
    </>
  );
};

export default MediaLibrary;
