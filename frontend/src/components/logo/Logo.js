import React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
// import { useTheme } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';


// ----------------------------------------------------------------------

const Logo = forwardRef(function Logo({ disabledLink = false, sx, ...other }, ref) {
  // const theme = useTheme();

  // const PRIMARY_LIGHT = theme.palette.primary.light;

  // const PRIMARY_MAIN = theme.palette.primary.main;

  // const PRIMARY_DARK = theme.palette.primary.dark;

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 40,
        height: 40,
        display: 'inline-flex',
        alignItems: "center",
        ...sx,
      }}
      {...other}
    >
      <img src="/assets/gradegoicon.png" alt="login"  />
        <Typography style={{paddingLeft:"10px"}}>GradeGo</Typography>
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.displayName = 'Logo';

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
