import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import Breadcrumb from '../navigation/Breadcrumb';

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  disablePaper?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ title, children, actions, disablePaper = false }) => {
  return (
    <Container maxWidth={false} sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 1 }}>
        <Breadcrumb />
      </Box>
      {disablePaper ? (
        <Box sx={{ minHeight: 'calc(100vh - 220px)' }}>{children}</Box>
      ) : (
        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, minHeight: 'calc(100vh - 220px)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          {children}
        </Paper>
      )}
    </Container>
  );
};

export default PageContainer;
