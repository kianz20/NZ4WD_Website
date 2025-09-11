import { Typography } from "@mui/material";
import { Header, HeadlineBanner, Navbar } from "../components";

const LatestNews = () => {
  return (
    <>
      <Header />
      <Navbar />
      <HeadlineBanner />
      <Typography variant="h4" component="h1">
        LatestNews
      </Typography>
    </>
  );
};

export default LatestNews;
