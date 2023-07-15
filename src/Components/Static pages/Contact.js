import React from "react";
import {
  Typography,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";

import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Navbar from "../Layouts/Navbar Creator/Navbar";

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Navbar noAccount={true} backgroundDark={true} />

      <Container
        maxWidth={false}
        style={{
          backgroundColor: "black",
          width: "100%",
          minHeight: "100vh",
          padding: "20px",
          paddingTop:"80px"
        }}
      >
        <Typography
          variant="h3"
          component="h4"
          style={{
            color: "white",
            fontSize: isMobile ? "3.9rem" : "6rem",
            marginLeft: "10px",
            width: "79%",
            margin: "auto",
            marginBottom: "30px",
          }}
        >
          Contact Us
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4} style={{ margin: "10px" }}>
            <Box
              border={2}
              borderColor="black"
              height={280}
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={6}
              padding={2}
              bgcolor="#101010"
              color="black"
            >
              <div style={{ margin: "10px" }}>
                <Typography
                  variant="h"
                  component="h2"
                  style={{ marginBottom: "20px", color: "white" }}
                >
                  Reach Out
                </Typography>
                <Typography
                  variant="h6"
                  component="p"
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                  }}
                >
                  <PhoneIcon style={{ marginRight: "5px" }} />
                  Phone: 8692006538
                </Typography>
                <Typography
                  variant="h6"
                  component="p"
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                  }}
                >
                  <EmailIcon style={{ marginRight: "5px" }} />
                  Email: info@anchors.in
                </Typography>
              </div>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} lg={4} style={{ margin: "10px" }}>
            <Box
              border={2}
              borderColor="black"
              height={280}
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={6}
              padding={2}
              bgcolor="#101010"
              color="black"
            >
              <div style={{ margin: "10px" }}>
                <Typography
                  variant="h"
                  component="h2"
                  style={{ marginBottom: "20px", color: "white" }}
                >
                  Address
                </Typography>
                <Typography
                  variant="h6"
                  component="p"
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                  }}
                >
                  <LocationOnIcon style={{ marginRight: "5px" }} />
                  B-8, Basement Sector 2 Noida 201301
                </Typography>
              </div>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Contact;
