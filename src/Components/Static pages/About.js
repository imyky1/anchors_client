import React from "react";
import {
  Typography,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/material";
import Navbar from "../Layouts/Navbar Creator/Navbar";
import { Footer3 } from "../Footer/Footer2";

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Navbar noAccount={true} backgroundDark={true} />

      <Container
        maxWidth={false}
        disableGutters
        style={{ height: "100vh", overflow: "auto", bgcolor: "black" }}
      >
        <Box
          sx={{ bgcolor: "#101010", minHeight: "100vh", overflow: "hidden" }}
        >
          <Container maxWidth={false} disableGutters>
            <Grid container>
              <Grid item xs={12}>
                <Box
                  sx={{
                    width: "100%",
                    marginBottom: "10px",
                    height: 300,
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-end",
                    bgcolor: "black",
                    color: "white",
                    // overflow:'hidden',
                  }}
                >
                  <Typography
                    variant="h3"
                    component="h4"
                    display="flex"
                    alignItems="center"
                    style={{
                      marginLeft: isMobile ? "60px" : "215px",
                      marginBottom: "30px",
                      color: "white",
                      fontSize: isMobile ? "4.5rem" : "6rem",
                      overflow: "hidden",
                    }}
                  >
                    About Us
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "#101010",
                    color: "black",
                    p: 4,
                    padding: "10px",
                  }}
                >
                  {/* <Scrollable> */}
                  <Container maxWidth="lg" style={{ marginTop: "20px" }}>
                    <Typography
                      variant="body1"
                      paragraph
                      style={{ fontWeight: "lighter", color: "white" }}
                    >
                      At Anchors, we are dedicated to providing creators with
                      the tools and opportunities they need to monetize their
                      content, time, and skills. We understand that creators
                      invest a significant amount of effort and creativity into
                      their work, and we believe they should be rewarded for
                      their valuable contributions.<br/> <br/> Our platform offers a unique
                      opportunity for creators to sell their digital products
                      and services directly to their audience. Whether it's an
                      e-book, online course, exclusive merchandise, or
                      personalized services, Anchors enables creators to
                      showcase their expertise and generate revenue from their
                      loyal fanbase.<br/> <br/> We provide a seamless and user-friendly
                      experience, allowing creators to set their own prices,
                      manage their services, and connect with their audience.
                      With Anchors, creators can focus on what they do best –
                      creating amazing content – while we take care of the
                      technical aspects of selling and delivering their digital
                      products.<br/> <br/> By leveraging the power of Anchors, creators can
                      transform their passion into a sustainable income stream.
                      We are committed to supporting creators every step of the
                      way, providing them with the tools, resources, and
                      guidance to succeed in the ever-evolving digital
                      landscape.<br/> <br/> Join Anchors and take control of your creative
                      journey. Monetize your content, unlock new opportunities,
                      and connect with a community of like-minded creators who
                      are dedicated to turning their passion into profit.
                      Welcome to Anchors, where creators thrive and monetization
                      becomes seamless.
                    </Typography>
                  </Container>

                  {/* <Container maxWidth="lg" style={{ marginTop: "20px" }}>
                    <Typography
                      variant="h4"
                      component="h1"
                      gutterBottom
                      style={{ color: "white" }}
                    >
                      Welcome to anchors
                    </Typography>
                    <Typography
                      variant="body1"
                      paragraph
                      style={{ fontWeight: "lighter", color: "white" }}
                    >
                      The premier platform for empowering creators and driving
                      the creator economy.
                    </Typography>

                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      style={{ marginTop: "40px", color: "white" }}
                    >
                      Our Mission
                    </Typography>
                    <Typography
                      variant="body1"
                      paragraph
                      style={{ fontWeight: "lighter", color: "white" }}
                    >
                      We believe in the transformative power of creators and
                      their ability to make a lasting impact on the world. Our
                      mission is to provide a comprehensive ecosystem that
                      enables creators to unlock their full potential and build
                      sustainable income streams.
                    </Typography>

                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      style={{ color: "white" }}
                    >
                      Challenges We Address
                    </Typography>
                    <Typography
                      variant="body1"
                      paragraph
                      style={{ fontWeight: "lighter", color: "white" }}
                    >
                      At anchors, we understand the challenges that creators
                      face in monetizing their skills, content, and expertise.
                      We have created a platform that offers a unique blend of
                      cutting-edge technology, community support, and innovative
                      features to help creators thrive in today's digital
                      landscape.
                    </Typography>

                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      style={{ color: "white" }}
                    >
                      Exclusive Community
                    </Typography>
                    <Typography
                      variant="body1"
                      paragraph
                      style={{ fontWeight: "lighter", color: "white" }}
                    >
                      anchors fosters an exclusive community of premium creators
                      who have demonstrated their prowess in the digital space.
                      By curating a community of like-minded individuals, we
                      ensure that creators can connect, collaborate, and learn
                      from each other, fostering growth and inspiration.
                    </Typography>

                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      style={{ color: "white" }}
                    >
                      Tech-Driven Monetization
                    </Typography>
                    <Typography
                      variant="body1"
                      paragraph
                      style={{ fontWeight: "lighter", color: "white" }}
                    >
                      anchors goes beyond traditional monetization approaches by
                      providing creators with a suite of powerful tech tools and
                      features. Our platform allows creators to offer paid and
                      free services, monetize their time, expertise, and
                      content, and tap into new revenue streams. We empower
                      creators with the control and flexibility they need to
                      succeed.
                    </Typography>

                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      style={{ color: "white" }}
                    >
                      Innovative Solutions
                    </Typography>
                    <Typography
                      variant="body1"
                      paragraph
                      style={{ fontWeight: "lighter", color: "white" }}
                    >
                      We understand that creators need more than just tools to
                      succeed. That's why anchors offers a holistic ecosystem
                      that includes detailed audience analysis, exclusive
                      support, and software solutions to simplify the creator's
                      journey. By taking care of the logistics, we enable
                      creators to focus on what they do best: creating
                      captivating content and engaging with their audience.
                    </Typography>

                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      style={{ color: "white" }}
                    >
                      Scaling for Growth
                    </Typography>
                    <Typography
                      variant="body1"
                      paragraph
                      style={{ fontWeight: "lighter", color: "white" }}
                    >
                      As the creator economy continues to evolve, anchors is
                      built to scale. Our robust infrastructure and scalable
                      architecture ensure a seamless experience for creators and
                      their audiences as our platform expands. We continually
                      evolve our features and functionalities based on user
                      feedback and market trends, staying ahead of the curve and
                      supporting the growth of creators.
                    </Typography>

                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      style={{ color: "white" }}
                    >
                      Join Anchors and take control of your creative journey.
                    </Typography>
                    <Typography
                      variant="body1"
                      paragraph
                      style={{ fontWeight: "lighter", color: "white" }}
                    >
                      Monetize your content, unlock new opportunities, and
                      connect with a community of like-minded creators who are
                      dedicated to turning their passion into profit. Welcome to
                      Anchors, where creators thrive and monetization becomes
                      seamless.
                    </Typography>
                  </Container> */}
                  {/* </Scrollable> */}
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Container>
    </>
  );
};

export default About;
