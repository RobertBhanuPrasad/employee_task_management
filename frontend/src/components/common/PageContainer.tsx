import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import Breadcrumb from '../navigation/Breadcrumb';

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ title, children, actions }) => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
        <Breadcrumb />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="h4" component="h1" color="text.primary">
            {title}
          </Typography>
          {actions && <Box>{actions}</Box>}
        </Box>
      </Box>
      <Paper sx={{ p: 3, borderRadius: 2, minHeight: 'calc(100vh - 220px)' }}>
        {children}
      </Paper>
    </Container>
  );
};

export default PageContainer;
