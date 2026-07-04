import React, { useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Box, 
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Skeleton,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import PageContainer from '../../components/common/PageContainer';
import DashboardCard from '../../components/common/DashboardCard';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { fetchAdminDashboard, fetchEmployeeDashboard } from '../../store/features/dashboardSlice';
import { fetchNotifications } from '../../store/features/notificationSlice';

import PeopleIcon from '@mui/icons-material/People';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import RefreshIcon from '@mui/icons-material/Refresh';

const EmptyState: React.FC<{ icon: React.ReactNode; message: string }> = ({ icon, message }) => (
  <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
    <Box sx={{ mb: 2, opacity: 0.5, transform: 'scale(1.5)' }}>
      {icon}
    </Box>
    <Typography variant="body1" color="text.secondary">{message}</Typography>
  </Box>
);

const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
      Unable to load data.
    </Alert>
    <Button variant="outlined" startIcon={<RefreshIcon />} onClick={onRetry} size="small">
      Retry
    </Button>
  </Box>
);

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { adminData, employeeData, loading, error } = useSelector((state: RootState) => state.dashboard);
  const { items: notifications, loading: notifLoading, error: notifError } = useSelector((state: RootState) => state.notification);

  const isAdmin = user?.role === 'ADMIN';
  const loadDashboardData = React.useCallback(() => {
    if (isAdmin) {
      dispatch(fetchAdminDashboard());
    } else {
      dispatch(fetchEmployeeDashboard());
    }
  }, [dispatch, isAdmin]);

  const loadNotificationData = React.useCallback(() => {
    dispatch(fetchNotifications({ limit: 5 }));
  }, [dispatch]);

  useEffect(() => {
    loadDashboardData();
    loadNotificationData();
  }, [loadDashboardData, loadNotificationData]);

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const todayDate = new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(new Date());

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'info';
      case 'PENDING': return 'warning';
      default: return 'default';
    }
  };

  const renderRecentNotifications = () => (
    <Grid xs={12} md={4}>
      <Paper elevation={1} sx={{ p: 0, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 3, pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Recent Notifications
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          {notifLoading ? (
            <Box sx={{ p: 3 }}><Skeleton variant="rectangular" height={250} /></Box>
          ) : notifError ? (
            <ErrorState onRetry={loadNotificationData} />
          ) : notifications && notifications.length > 0 ? (
            <List disablePadding>
              {notifications.slice(0, 5).map((notif, idx) => (
                <React.Fragment key={notif.id}>
                  <ListItem sx={{ py: 2, px: 3 }}>
                    <ListItemText 
                      primary={<Typography variant="subtitle2" sx={{ fontWeight: 600, color: notif.is_read ? 'text.secondary' : 'text.primary' }}>{notif.title}</Typography>}
                      secondary={<Typography variant="body2" noWrap color="text.secondary">{notif.message}</Typography>}
                    />
                    {!notif.is_read && (
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', ml: 1, flexShrink: 0 }} />
                    )}
                  </ListItem>
                  {idx < Math.min(notifications.length - 1, 4) && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <EmptyState icon={<NotificationsOffIcon fontSize="large" />} message="No notifications available" />
          )}
        </Box>
      </Paper>
    </Grid>
  );

  const renderAdminWidgets = () => {
    const admin = adminData;
    return (
      <>
        <Grid xs={12} md={3}>
          <DashboardCard
            title="Total Employees"
            value={admin?.stats?.totalEmployees || 0}
            icon={<PeopleIcon />}
            color={theme.palette.primary.main}
            loading={loading}
          />
        </Grid>
        <Grid xs={12} md={3}>
          <DashboardCard
            title="Total Tasks"
            value={admin?.stats?.totalTasks || 0}
            icon={<AssignmentIcon />}
            color={theme.palette.info.main}
            loading={loading}
          />
        </Grid>
        <Grid xs={12} md={3}>
          <DashboardCard
            title="Completed Tasks"
            value={admin?.stats?.completedTasks || 0}
            icon={<TaskAltIcon />}
            color={theme.palette.success.main}
            loading={loading}
          />
        </Grid>
        <Grid xs={12} md={3}>
          <DashboardCard
            title="Pending/In-Progress"
            value={(admin?.stats?.pendingTasks || 0) + (admin?.stats?.inProgressTasks || 0)}
            icon={<PendingActionsIcon />}
            color={theme.palette.warning.main}
            loading={loading}
          />
        </Grid>

        {/* Charts & Lists */}
        <Grid xs={12} md={8}>
          <Paper elevation={1} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Task Status Overview
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              {loading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : error ? (
                <ErrorState onRetry={loadDashboardData} />
              ) : (admin?.stats && (admin.stats.totalTasks > 0)) ? (
                <Box sx={{ width: '100%', height: 320 }}>
                  <BarChart
                    xAxis={[{ scaleType: 'band', data: ['Completed', 'In Progress', 'Pending', 'Overdue'] }]}
                    series={[
                      { 
                        data: [
                          admin.stats.completedTasks, 
                          admin.stats.inProgressTasks, 
                          admin.stats.pendingTasks, 
                          admin.stats.overdueTasks
                        ],
                        color: theme.palette.primary.main
                      }
                    ]}
                    height={300}
                  />
                </Box>
              ) : (
                <EmptyState icon={<CheckBoxOutlineBlankIcon fontSize="large" />} message="No tasks data available" />
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid xs={12} md={4}>
          <Paper elevation={1} sx={{ p: 0, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, pb: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                Recent Tasks
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              {loading ? (
                <Box sx={{ p: 3 }}><Skeleton variant="rectangular" height={250} /></Box>
              ) : error ? (
                <ErrorState onRetry={loadDashboardData} />
              ) : admin?.recentTasks && admin.recentTasks.length > 0 ? (
                <List disablePadding>
                  {admin.recentTasks.slice(0, 5).map((task, idx) => (
                    <React.Fragment key={task.id}>
                      <ListItem sx={{ py: 2, px: 3 }}>
                        <ListItemText 
                          primary={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{task.title}</Typography>}
                          secondary={new Date(task.due_date).toLocaleDateString()}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                          <Chip size="small" label={task.status} color={getStatusColor(task.status)} />
                          <Chip size="small" label={task.priority} color={getPriorityColor(task.priority)} variant="outlined" />
                        </Box>
                      </ListItem>
                      {idx < Math.min(admin.recentTasks.length - 1, 4) && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <EmptyState icon={<CheckBoxOutlineBlankIcon fontSize="large" />} message="No recent tasks" />
              )}
            </Box>
          </Paper>
        </Grid>
        
        {renderRecentNotifications()}
      </>
    );
  };

  const renderEmployeeWidgets = () => {
    const emp = employeeData;
    return (
      <>
        <Grid xs={12} md={3}>
          <DashboardCard
            title="My Tasks"
            value={emp?.stats?.myTasks || 0}
            icon={<AssignmentIcon />}
            color={theme.palette.info.main}
            loading={loading}
          />
        </Grid>
        <Grid xs={12} md={3}>
          <DashboardCard
            title="Completed"
            value={emp?.stats?.completedTasks || 0}
            icon={<TaskAltIcon />}
            color={theme.palette.success.main}
            loading={loading}
          />
        </Grid>
        <Grid xs={12} md={3}>
          <DashboardCard
            title="Due Today"
            value={emp?.stats?.tasksDueToday || 0}
            icon={<EventAvailableIcon />}
            color={theme.palette.warning.main}
            loading={loading}
          />
        </Grid>
        <Grid xs={12} md={3}>
          <DashboardCard
            title="Overdue"
            value={emp?.stats?.overdueTasks || 0}
            icon={<WarningIcon />}
            color={theme.palette.error.main}
            loading={loading}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <Paper elevation={1} sx={{ p: 0, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, pb: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                Upcoming Deadlines
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              {loading ? (
                <Box sx={{ p: 3 }}><Skeleton variant="rectangular" height={250} /></Box>
              ) : error ? (
                <ErrorState onRetry={loadDashboardData} />
              ) : emp?.upcomingDeadlines && emp.upcomingDeadlines.length > 0 ? (
                <List disablePadding>
                  {emp.upcomingDeadlines.slice(0, 5).map((task, idx) => (
                    <React.Fragment key={task.id}>
                      <ListItem sx={{ py: 2, px: 3 }}>
                        <ListItemText 
                          primary={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{task.title}</Typography>}
                          secondary={`Due: ${new Date(task.due_date).toLocaleDateString()}`}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                          <Chip size="small" label={task.priority} color={getPriorityColor(task.priority)} />
                        </Box>
                      </ListItem>
                      {idx < Math.min(emp.upcomingDeadlines.length - 1, 4) && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <EmptyState icon={<EventBusyIcon fontSize="large" />} message="No upcoming deadlines" />
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid xs={12} md={4}>
          <Paper elevation={1} sx={{ p: 0, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, pb: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                Recently Assigned
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              {loading ? (
                <Box sx={{ p: 3 }}><Skeleton variant="rectangular" height={250} /></Box>
              ) : error ? (
                <ErrorState onRetry={loadDashboardData} />
              ) : emp?.latestAssignedTasks && emp.latestAssignedTasks.length > 0 ? (
                <List disablePadding>
                  {emp.latestAssignedTasks.slice(0, 5).map((task, idx) => (
                    <React.Fragment key={task.id}>
                      <ListItem sx={{ py: 2, px: 3 }}>
                        <ListItemText 
                          primary={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{task.title}</Typography>}
                          secondary={`Status: ${task.status}`}
                        />
                        <Chip size="small" label={task.priority} color={getPriorityColor(task.priority)} variant="outlined" />
                      </ListItem>
                      {idx < Math.min(emp.latestAssignedTasks.length - 1, 4) && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <EmptyState icon={<CheckBoxOutlineBlankIcon fontSize="large" />} message="No recent tasks" />
              )}
            </Box>
          </Paper>
        </Grid>

        {renderRecentNotifications()}
      </>
    );
  };

  return (
    <PageContainer title="Dashboard">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
            {greeting}, {user?.full_name?.split(' ')[0] || 'User'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {todayDate}
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => { loadDashboardData(); loadNotificationData(); }}>
          Refresh
        </Button>
      </Box>

      {error && !loading && !adminData && !employeeData && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Dashboard failed to load completely: {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {isAdmin ? renderAdminWidgets() : renderEmployeeWidgets()}
      </Grid>
    </PageContainer>
  );
};

export default Dashboard;
