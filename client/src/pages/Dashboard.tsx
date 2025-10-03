import { Typography } from "@mui/material";
import { Header, HeadlineBanner, Navbar } from "../components";
import { useRequireAuth } from "../hooks";

const Dashboard = () => {
  useRequireAuth();
  return (
    <>
      <Header />
      <Navbar />
      <HeadlineBanner />
      <Typography variant="h4" component="h1">
        Dashboard
      </Typography>
    </>
  );
};

export default Dashboard;
