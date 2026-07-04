import React, { useEffect, useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import DownloadIcon from '@mui/icons-material/Download';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import GroupIcon from '@mui/icons-material/Group';

import PageContainer from '../../components/common/PageContainer';
import type { AppDispatch, RootState } from '../../store';
import { 
  fetchCompletedTasksReport, 
  fetchPendingTasksReport, 
  fetchEmployeeWiseReport, 
  exportReportData,
  clearReportMessages
} from '../../store/features/reportSlice';
import { fetchEmployees } from '../../store/features/employeeSlice';

const CustomNoRowsOverlay = () => (
  <GridOverlay>
    <Typography color="text.secondary">No records found for the selected criteria</Typography>
  </GridOverlay>
);

const Reports: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    completedTasks, 
    pendingTasks, 
    employeeWise, 
    loading, 
    exportLoading, 
    error, 
    successMessage 
  } = useSelector((state: RootState) => state.report);
  const { items: employees, loading: employeesLoading } = useSelector((state: RootState) => state.employee);

  const [tabIndex, setTabIndex] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch employees for filter dropdown
  useEffect(() => {
    dispatch(fetchEmployees({ limit: 500 }));
  }, [dispatch]);

  const activeFilters = useMemo(() => ({
    search: search || undefined,
    employeeId: employeeId || undefined,
    priority: priority || undefined,
    status: status || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  }), [search, employeeId, priority, status, startDate, endDate]);

  const fetchActiveReport = () => {
    if (tabIndex === 0) dispatch(fetchCompletedTasksReport(activeFilters));
    else if (tabIndex === 1) dispatch(fetchPendingTasksReport(activeFilters));
    else if (tabIndex === 2) dispatch(fetchEmployeeWiseReport(activeFilters));
  };

  useEffect(() => {
    fetchActiveReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabIndex, dispatch, activeFilters]);

  const handleExport = (format: 'csv' | 'excel') => {
    let type: 'completed' | 'pending' | 'employee-wise' = 'completed';
    if (tabIndex === 1) type = 'pending';
    if (tabIndex === 2) type = 'employee-wise';
    dispatch(exportReportData({ type, format, filters: activeFilters }));
  };

  // Define Columns
  const completedCols: GridColDef[] = [
    { field: 'Task ID', headerName: 'Task ID', width: 100 },
    { field: 'Title', headerName: 'Title', flex: 1, minWidth: 200 },
    { field: 'Employee Name', headerName: 'Employee', width: 180 },
    { field: 'Department', headerName: 'Department', width: 150 },
    { field: 'Priority', headerName: 'Priority', width: 120 },
    { 
      field: 'Completed Date', 
      headerName: 'Completed Date', 
      width: 180,
      renderCell: (params: GridRenderCellParams) => new Date(params.value).toLocaleDateString()
    },
  ];

  const pendingCols: GridColDef[] = [
    { field: 'Task ID', headerName: 'Task ID', width: 100 },
    { field: 'Title', headerName: 'Title', flex: 1, minWidth: 200 },
    { field: 'Employee Name', headerName: 'Employee', width: 180 },
    { field: 'Priority', headerName: 'Priority', width: 120 },
    { field: 'Status', headerName: 'Status', width: 130 },
    { 
      field: 'Due Date', 
      headerName: 'Due Date', 
      width: 150,
      renderCell: (params: GridRenderCellParams) => params.value ? new Date(params.value).toLocaleDateString() : 'N/A'
    },
  ];

  const employeeCols: GridColDef[] = [
    { field: 'Employee Name', headerName: 'Employee Name', flex: 1, minWidth: 200 },
    { field: 'Department', headerName: 'Department', width: 150 },
    { field: 'Total Tasks', headerName: 'Total Tasks', width: 130, type: 'number' },
    { field: 'Completed Tasks', headerName: 'Completed', width: 130, type: 'number' },
    { field: 'Pending Tasks', headerName: 'Pending', width: 130, type: 'number' },
    { field: 'Overdue Tasks', headerName: 'Overdue', width: 130, type: 'number' },
  ];

  const getCurrentData = () => {
    if (tabIndex === 0) return completedTasks.map((row, index) => ({ id: row['Task ID'] || index, ...row }));
    if (tabIndex === 1) return pendingTasks.map((row, index) => ({ id: row['Task ID'] || index, ...row }));
    if (tabIndex === 2) return employeeWise.map((row, index) => ({ id: index, ...row }));
    return [];
  };

  const getCurrentCols = () => {
    if (tabIndex === 0) return completedCols;
    if (tabIndex === 1) return pendingCols;
    return employeeCols;
  };

  return (
    <PageContainer title="Reports Dashboard">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssessmentIcon fontSize="large" color="primary" /> Reports Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={exportLoading ? <CircularProgress size={20} /> : <DownloadIcon />} 
            onClick={() => handleExport('csv')}
            disabled={exportLoading || loading}
          >
            Export CSV
          </Button>
          <Button 
            variant="contained" 
            startIcon={exportLoading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />} 
            onClick={() => handleExport('excel')}
            disabled={exportLoading || loading}
          >
            Export Excel
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              cursor: 'pointer', 
              transition: 'all 0.2s', 
              border: tabIndex === 0 ? 2 : 1, 
              borderColor: tabIndex === 0 ? 'primary.main' : 'divider',
              boxShadow: tabIndex === 0 ? 4 : 1,
              '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
            }}
            onClick={() => setTabIndex(0)}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'success.light', color: 'success.dark', display: 'flex' }}>
                <AssignmentTurnedInIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>Completed Tasks</Typography>
                <Typography variant="body2" color="text.secondary">View all finished assignments</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              cursor: 'pointer', 
              transition: 'all 0.2s', 
              border: tabIndex === 1 ? 2 : 1, 
              borderColor: tabIndex === 1 ? 'primary.main' : 'divider',
              boxShadow: tabIndex === 1 ? 4 : 1,
              '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
            }}
            onClick={() => setTabIndex(1)}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'warning.light', color: 'warning.dark', display: 'flex' }}>
                <PendingActionsIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>Pending Tasks</Typography>
                <Typography variant="body2" color="text.secondary">Track ongoing and overdue items</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              cursor: 'pointer', 
              transition: 'all 0.2s', 
              border: tabIndex === 2 ? 2 : 1, 
              borderColor: tabIndex === 2 ? 'primary.main' : 'divider',
              boxShadow: tabIndex === 2 ? 4 : 1,
              '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
            }}
            onClick={() => setTabIndex(2)}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'info.light', color: 'info.dark', display: 'flex' }}>
                <GroupIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>Employee Analytics</Typography>
                <Typography variant="body2" color="text.secondary">Performance by team members</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error ? (
        <Paper elevation={1} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Alert severity="error" sx={{ mb: 3, width: '100%', maxWidth: 600 }}>
            {error}
          </Alert>
          <Button variant="outlined" onClick={fetchActiveReport}>
            Retry Loading Report
          </Button>
        </Paper>
      ) : (
        <Paper elevation={1} sx={{ p: 0, overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabIndex} onChange={(_, val) => setTabIndex(val)} variant="fullWidth">
              <Tab label="Completed Tasks Report" />
              <Tab label="Pending Tasks Report" />
              <Tab label="Employee Performance Report" />
            </Tabs>
          </Box>

          {/* Filters Bar */}
          <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
            <TextField
              placeholder="Search..."
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flexGrow: 1, minWidth: 200 }}
            />
            {tabIndex !== 2 && (
              <>
                <TextField
                  select
                  label="Priority"
                  size="small"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="">All Priorities</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                </TextField>
                {tabIndex === 1 && (
                  <TextField
                    select
                    label="Status"
                    size="small"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  </TextField>
                )}
              </>
            )}
            <TextField
              select
              label="Employee"
              size="small"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              sx={{ minWidth: 200 }}
              disabled={employeesLoading}
            >
              <MenuItem value="">All Employees</MenuItem>
              {employees.map(emp => (
                <MenuItem key={emp.id} value={emp.id.toString()}>{emp.full_name}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />
            <TextField
              label="End Date"
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />
          </Box>

          {/* DataGrid */}
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={getCurrentData()}
              columns={getCurrentCols()}
              loading={loading}
              pagination
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[10, 25, 50, 100]}
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

      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={4000} 
        onClose={() => dispatch(clearReportMessages())}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => dispatch(clearReportMessages())} sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default Reports;
