import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';

import PageContainer from '../../components/common/PageContainer';
import type { AppDispatch, RootState } from '../../store';
import { fetchNotifications, markAsRead, markAllAsRead, clearNotificationMessages, fetchUnreadCount } from '../../store/features/notificationSlice';
import type { Notification } from '../../services/notification.service';

import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

import NotificationDetailsDrawer from './NotificationDetailsDrawer';

const CustomNoRowsOverlay = () => (
  <GridOverlay>
    <Typography color="text.secondary">No notifications available</Typography>
  </GridOverlay>
);

const getTypeColor = (type: string) => {
  switch (type) {
    case 'TASK_ASSIGNED': return 'primary';
    case 'TASK_COMPLETED': return 'success';
    case 'TASK_DUE': return 'warning';
    case 'SYSTEM': return 'default';
    default: return 'default';
  }
};

const NotificationsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, loading, error, successMessage, actionLoading, actionError } = useSelector((state: RootState) => state.notification);

  // DataGrid State
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'created_at', sort: 'desc' }]);
  
  // Filter States
  const [filterType, setFilterType] = useState('ALL');

  // Dialog States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const fetchParams = useCallback(() => {
    return {
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
    };
  }, [paginationModel]);

  useEffect(() => {
    dispatch(fetchNotifications(fetchParams()));
  }, [dispatch, fetchParams]);

  const handleRefresh = () => {
    dispatch(fetchNotifications(fetchParams()));
    dispatch(fetchUnreadCount());
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead()).then(() => handleRefresh());
  };

  const handleMarkRead = (id: number) => {
    dispatch(markAsRead(id));
  };

  const handleOpenDrawer = (notification: Notification) => {
    setSelectedNotification(notification);
    setDrawerOpen(true);
    if (!notification.is_read) {
      handleMarkRead(notification.id);
    }
  };

  // Local filtering because backend doesn't support filter params for notifications
  const filteredItems = useMemo(() => {
    let filtered = [...items];
    if (filterType === 'READ') filtered = filtered.filter(n => n.is_read);
    else if (filterType === 'UNREAD') filtered = filtered.filter(n => !n.is_read);
    else if (filterType !== 'ALL') {
      filtered = filtered.filter(n => n.type === filterType);
    }
    
    // Local sorting (backend doesn't support sorting params either)
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      filtered.sort((a: any, b: any) => {
        if (a[field] < b[field]) return sort === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return sort === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [items, filterType, sortModel]);

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', flex: 1, minWidth: 200, renderCell: (params: GridRenderCellParams) => (
      <Typography variant="body2" fontWeight={params.row.is_read ? 400 : 700}>
        {params.value}
      </Typography>
    )},
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={params.value.replace('_', ' ')} 
          color={getTypeColor(params.value)} 
          size="small" 
        />
      )
    },
    { 
      field: 'is_read', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={params.value ? 'Read' : 'Unread'} 
          color={params.value ? 'default' : 'error'} 
          size="small" 
          variant={params.value ? 'outlined' : 'filled'}
        />
      )
    },
    { 
      field: 'created_at', 
      headerName: 'Date', 
      width: 160,
      renderCell: (params: GridRenderCellParams) => new Date(params.value).toLocaleString()
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => handleOpenDrawer(params.row as Notification)} color="info">
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {!params.row.is_read && (
            <Tooltip title="Mark as Read">
              <IconButton size="small" onClick={() => handleMarkRead((params.row as Notification).id)} color="primary">
                <MarkEmailReadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  const handleCloseMessages = () => {
    dispatch(clearNotificationMessages());
  };

  return (
    <PageContainer title="Notifications">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          Notifications
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<DoneAllIcon />} onClick={handleMarkAllRead} disabled={actionLoading}>
            Mark All as Read
          </Button>
        </Box>
      </Box>

      {error ? (
        <Paper elevation={1} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Alert severity="error" sx={{ mb: 3, width: '100%', maxWidth: 600 }}>
            {error}
          </Alert>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
            Retry
          </Button>
        </Paper>
      ) : (
        <Paper elevation={1} sx={{ p: 0, overflow: 'hidden' }}>
          <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', borderBottom: 1, borderColor: 'divider' }}>
            <TextField
              select
              label="Filter By"
              size="small"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="ALL">All Notifications</MenuItem>
              <MenuItem value="READ">Read</MenuItem>
              <MenuItem value="UNREAD">Unread</MenuItem>
              <MenuItem value="TASK_ASSIGNED">Task Assigned</MenuItem>
              <MenuItem value="TASK_DUE">Task Due</MenuItem>
              <MenuItem value="TASK_COMPLETED">Task Completed</MenuItem>
            </TextField>
          </Box>

          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredItems}
              columns={columns}
              rowCount={total}
              loading={loading}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              sortModel={sortModel}
              onSortModelChange={setSortModel}
              paginationMode="server"
              pageSizeOptions={[5, 10, 25, 50]}
              disableRowSelectionOnClick
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
              }}
              sx={{
                border: 0,
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
            />
          </Box>
        </Paper>
      )}

      <NotificationDetailsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        notification={selectedNotification}
      />

      <Snackbar 
        open={!!successMessage || !!actionError} 
        autoHideDuration={4000} 
        onClose={handleCloseMessages}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={actionError ? "error" : "success"} 
          onClose={handleCloseMessages} 
          sx={{ width: '100%' }}
        >
          {actionError || successMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default NotificationsList;
