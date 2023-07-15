import React from 'react';
import { Typography, Container, Grid, useTheme, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Navbar from '../Layouts/Navbar Creator/Navbar';

const TermsAndConditions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 

  return (
    <>
    <Navbar noAccount={true} backgroundDark={true}/>

    <Container maxWidth={false} disableGutters style={{ height: '100vh', overflow: 'auto', backgroundColor: 'black' }}>
      <Box sx={{ backgroundColor: '#101010', minHeight: '100vh', overflow: 'hidden' }}>
        <Container maxWidth={false} disableGutters>
          <Grid container>
            <Grid item xs={12}>
              <Box
                sx={{
                  width: '100%',
                  marginBottom: '10px',
                  height: 300,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-end',
                  backgroundColor: 'black',
                  color: 'white',
                }}
              >
                <Typography
                  variant="h3"
                  component="h4"
                  display="flex"
                  alignItems="flex-start"
                  style={{
                    marginLeft: isMobile ? '56px' : '215px',
                    marginBottom: '70px',
                    color: 'white',
                    fontSize: isMobile ? '4rem' : '6rem',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  Terms and Conditions
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#101010',
                  color: 'black',
                  p: 4,
                  padding:'10px'
                }}
              >
                <Container maxWidth="lg" style={{ marginTop: '20px' }}>
                  <Typography variant="body1" paragraph style={{ fontWeight: 'bold', marginBottom: '35px', color: 'white', fontSize: isMobile ? '1rem' : '20px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                    By signing up as a creator on anchors, you agree to the following terms and conditions:
                  </Typography>
                  <Typography variant="h6" component="h2" gutterBottom style={{ color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                    1. Eligibility:
                  </Typography>
                  <Typography variant="body1" paragraph style={{ fontWeight: 'lighter', color: 'white' }}>
                    1.1. You must be at least 18 years old to become a creator on anchors.
                  </Typography>
                  <Typography variant="h6" component="h2" gutterBottom style={{ color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                    2. Account Registration:
                  </Typography>
                  <Typography variant="body1" paragraph style={{ fontWeight: 'lighter', color: 'white' }}>
                    2.1. You must provide accurate and complete information during the registration process.
                    <br />
                    2.2. You are responsible for maintaining the confidentiality of your account credentials and for any activities that occur under your account.
                    <br />
                    2.3. You agree to notify us immediately of any unauthorized use or breach of security related to your account.
                  </Typography>
                  <Typography variant="h6" component="h2" gutterBottom style={{ color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                    3. Creator Guidelines:
                  </Typography>
                  <Typography variant="body1" paragraph style={{ fontWeight: 'lighter', color: 'white' }}>
                    3.1. As a creator of anchors, you agree to comply with our guidelines and policies regarding content creation, quality standards, and community guidelines.
                    <br />
                    3.2. You bear full responsibility for the content you generate and distribute on this platform, and ensure that it complies with all relevant laws regarding copyright, intellectual property, and other applicable regulations.
                  </Typography>
                  <Typography variant="h6" component="h2" gutterBottom style={{ color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                    4. Platform Fees:
                  </Typography>
                  <Typography variant="body1" paragraph style={{ fontWeight: 'lighter', color: 'white' }}>
                    4.1. anchors charges a platform fee of 10% on the total earnings generated by creators through the platform.
                    <br />
                    4.2. The platform fee may be subject to change, and any updates will be communicated to you in advance.
                  </Typography>
                  <Typography variant="h6" component="h2" gutterBottom style={{ color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                    5. Payment Terms:
                  </Typography>
                  <Typography variant="body1" paragraph style={{ fontWeight: 'lighter', color: 'white' }}>
                    5.1. Earnings from your creator activities will be paid out on a monthly basis.
                    <br />
                    5.2. Payment will be made to the bank account provided by you during the registration process.
                    <br />
                    5.3. anchors reserves the right to withhold or delay payments in case of suspected fraudulent activities or violation of our terms and conditions.
                  </Typography>
                  <Typography variant="h6" component="h2" gutterBottom style={{ color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                    6. Termination:
                  </Typography>
                  <Typography variant="body1" paragraph style={{ fontWeight: 'lighter', color: 'white' }}>
                    6.1. anchors reserves the right to suspend or terminate your account and access to the platform at any time, for any reason, without prior notice.
                    <br />
                    6.2. You may also request the termination of your account by contacting anchors support.
                  </Typography>
                  <Typography variant="h6" component="h2" gutterBottom style={{ color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                    7. Updates and Modifications:
                  </Typography>
                  <Typography variant="body1" paragraph style={{ fontWeight: 'lighter', color: 'white' }}>
                    7.1. anchors may update or modify these terms and conditions from time to time. Any changes will be communicated to you via email or by posting a notice on the platform.
                  </Typography>
                  <Typography variant="h6" component="h2" gutterBottom style={{ color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                    8. Governing Law:
                  </Typography>
                  <Typography variant="body1" paragraph style={{ fontWeight: 'lighter', color: 'white' }}>
                    8.1. These terms and conditions shall be governed by and construed in accordance with the laws of India.
                  </Typography>
                  <Typography variant="body1" paragraph style={{ marginTop: '60px', color: 'white' }}>
                    It is crucial that you thoroughly read and comprehend the terms and conditions stated by AlphaHive Anchors Pvt Ltd. By proceeding with the sign-up process, you acknowledge your understanding of these terms and conditions and willingly accept to be legally bound by them.
                  </Typography>
                </Container>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Container>
    
    </>
  );
};

export default TermsAndConditions;
