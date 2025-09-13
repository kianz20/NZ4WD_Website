import { Typography } from "@mui/material";
import { Header, HeadlineBanner, Navbar, SearchBar } from "../components";

const Home = () => {
  return (
    <>
      <Header />
      <Navbar />
      <HeadlineBanner />
      <Typography variant="h4" component="h1">
        Home
      </Typography>
      <SearchBar />
    </>
  );
};

export default Home;
