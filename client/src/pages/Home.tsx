import { Typography } from "@mui/material";
import { Header, HeadlineBanner, Navbar } from "../components";

const Home = () => {
  return (
    <>
      <Header />
      <Navbar />
      <HeadlineBanner />
      <Typography variant="h4" component="h1">
        Home
      </Typography>
    </>
  );
};

export default Home;
