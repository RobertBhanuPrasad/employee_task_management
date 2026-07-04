import React from 'react';
import { Typography, Grid, Card, CardContent } from '@mui/material';
import PageContainer from '../../components/common/PageContainer';

const Dashboard: React.FC = () => {
  return (
    <PageContainer title="Dashboard">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Employees
              </Typography>
              <Typography variant="h3">
                124
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Active Tasks
              </Typography>
              <Typography variant="h3">
                38
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Pending Reports
              </Typography>
              <Typography variant="h3">
                12
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Welcome to the enterprise HRMS Dashboard. Use the sidebar to navigate to different modules.
          </Typography>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Dashboard;
