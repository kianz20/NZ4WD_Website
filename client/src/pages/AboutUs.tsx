import { Box, Typography } from "@mui/material";
import { Header, Navbar } from "../components";
import pfp from "../assets/profilePicture.png";

const AboutUs = () => {
  return (
    <>
      <Header />
      <Navbar />
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
          My involvement with NZ4WD magazine goes way back. All the way to the
          closing years of the 20th Century. In the 1990s I was working for an
          agency, doing PR for Land Rover (among others). I was also in the grip
          of a lifelong addiction to motorsport, and the event that most
          captured my imagination was the Taupo 1000 off-road race. My brother
          Gary and I competed in the first 1000, and then in 1996 we watched the
          two-day mega-enduro. I shot rolls and rolls of film, and wrote an
          article on the race for NZ4WD editor Wayne Munro. That went to
          something like ten pages. In those days, utes were utes. Not a lot of
          sophistication, just a ladder chassis, a couple of live diffs and a
          body bolted on top. In those days the best-seller was Toyota's
          Corolla, followed by the Ford Falcon and Holden Commodore, with hardly
          a 4WD in the top ten. How things have changed. From then on, I was a
          regular contributor of automotive and 4WD motorsport content, and
          during Ross McKay's time as editor was also a regular writer as part
          of the drive team on multi-vehicle tests. Settling into the editor's
          chair in late 2021 was a strange experience. With the country still
          suffering under the long Covid lockdowns, it was a challenge to find
          locations to test and photograph 4WDs in off-road settings. We did
          bump into Covid border roadblocks a few times - "Good morning
          constable, all right if we do a u-turn here?" Things got more
          interesting when we could drive around more freely, and a few auto
          brands started running launches again. We've seen a fair few in my
          time, some real stand-outs too, including epic Aussie trips to drive
          Ineos 4WDs and also with Bridgestone to sample its latest all-terrain
          tyres on beaches north of Noosa. Best of the launches? That's easy.
          The two-day event for the Ineos Quartermaster ute, which took us into
          the mighty Flinders region in South Australia to drive the vehicle
          across hundreds of kilometres of countryside where everything is a
          shade of red echoing the dirt and dust of ancient Australia. In a
          different way, Fieldays is always a highlight, taking its place as New
          Zealand's de facto car show. It's still the best place to go for
          anyone wanting to see an immense array of the latest 4WDs and SUVs all
          clustered together in a couple of hectares So now we reach the end of
          the drive. Sad to say, this will be the last time readers can hold a
          hard copy of NZ4WD magazine in their hands, or casually leave it on
          the coffee table for friends to enjoy It's been a short ride for me.
          but I'm looking back through nearly 30 years of involvement in the
          magazine and - remembering that change is the only constant in our
          lives - looking forward to what’s next. Big thanks to publisher Cathy,
          to Sean Willmot, Dave McLeod, to all the editors I have worked with,
          and to our columnists and contributors. All of you have helped enrich
          the magazine over the years.
        </Typography>
      </Box>
    </>
  );
};

export default AboutUs;
