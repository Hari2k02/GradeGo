/*
  File: LoginPage.js
  Description: This file contains the component for the login page.
*/

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { Container, Typography, Divider } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
import Logo from '../components/logo';
import { LoginForm } from '../sections/auth/login';

// Styled root container for the login page
const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

// Styled section container for the illustration (visible on medium and larger screens)
const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

// Styled content container for the login form and related components
const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

/**
 * Component for the login page.
 */
export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');

  return (
    <>
      {/* Document Title */}
      <Helmet>
        <title>Login | GradeGo</title>
      </Helmet>

      <StyledRoot>
        {/* Logo */}
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {/* Illustration section (visible on medium and larger screens) */}
        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          {/* Content section */}
          <StyledContent>
            {/* Login Title */}
            <Typography variant="h4" gutterBottom>
              GradeGo Login
            </Typography>

            {/* Commented out code */}
            {/* <Typography variant="body2" sx={{ mb: 5 }}>
              Don’t have an account? {''}
              <Link variant="subtitle2">Get started</Link>
            </Typography> */}

            {/* Commented out code */}
            {/* <Stack direction="row" spacing={2}>
              <Button fullWidth size="large" color="inherit" variant="outlined">
                <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
              </Button>

              <Button fullWidth size="large" color="inherit" variant="outlined">
                <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
              </Button>

              <Button fullWidth size="large" color="inherit" variant="outlined">
                <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
              </Button>
            </Stack> */}

            {/* Divider */}
            <Divider sx={{ my: 3 }}></Divider>

            {/* Login Form */}
            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
