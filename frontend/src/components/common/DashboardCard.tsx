import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import type { SvgIconProps } from '@mui/material';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement<SvgIconProps>;
  color?: string;
  loading?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'primary.main', 
  loading = false 
}) => {
  return (
    <Card elevation={1} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {loading ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Skeleton width="60%" height={24} />
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
            <Skeleton width="40%" height={60} />
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600} textTransform="uppercase">
                {title}
              </Typography>
              <Box 
                sx={{ 
                  backgroundColor: `${color}15`, // Adding transparency
                  color: color,
                  p: 1, 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {icon}
              </Box>
            </Box>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {value}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
