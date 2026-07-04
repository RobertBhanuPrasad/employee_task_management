import React from 'react';
import { Breadcrumbs, Typography, Link } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Capitalize first letter of string
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mb: 2 }}
    >
      <Link
        component={RouterLink}
        underline="hover"
        color="inherit"
        to="/dashboard"
      >
        Dashboard
      </Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        // Don't duplicate dashboard if it's the root
        if (value.toLowerCase() === 'dashboard' && index === 0) {
          return null;
        }

        return last ? (
          <Typography color="text.primary" key={to} fontWeight={500}>
            {capitalize(value)}
          </Typography>
        ) : (
          <Link
            component={RouterLink}
            underline="hover"
            color="inherit"
            to={to}
            key={to}
          >
            {capitalize(value)}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
