import { Box, Typography } from "@mui/material";
import { Header, HeadlineBanner, Navbar } from "../../components";
import pfp from "../../assets/profilePicture.png";

const About = () => {
  return (
    <>
      <Header />
      <Navbar />
      <HeadlineBanner />
      <Box display="flex" justifyContent="center">
        <Box component="img" src={pfp} width="500px" />
      </Box>
      <br />
      <Box display="flex" justifyContent="center">
        <Typography variant="h4" component="h1">
          About Us
        </Typography>
      </Box>
      <br />
      <Box display="flex" justifyContent="center">
        <Typography align="justify" variant="body2" width="700px">
          This website is designed to explore the wide world of 4WD lifestyles
          and vehicles. <br />
          It exists to ensure that the vehicles and activities we all love have
          a resilient online presence. If it’s about 4WDs, it’s here. Mark Baker
          - Editor Passionate about all things automotive, site editor and
          content creator Mark Baker learned to drive in a Series II Land Rover
          pickup and a first-generation Range Rover. In his career, he has
          worked in communications roles for a range of premier automotive
          brands including BMW, Land Rover, Castrol and Volvo. He has edited
          publications for BMW, Castrol and the 4WD sector and is a columnist
          for a range of New Zealand automotive magazines.
        </Typography>
      </Box>
    </>
  );
};

export default About;
