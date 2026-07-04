import React, { useEffect, useState, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Tooltip,
  Snackbar,
  Alert,
  MenuItem
} from '@mui/material';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';

import PageContainer from '../../components/common/PageContainer';
import type { AppDispatch, RootState } from '../../store';
import { fetchTasks, clearTaskMessages } from '../../store/features/taskSlice';
import { fetchEmployees } from '../../store/features/employeeSlice';
import type { Task } from '../../services/task.service';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';

import TaskFormDialog from './TaskFormDialog';
import TaskDeleteDialog from './TaskDeleteDialog';
import TaskDetailsDrawer from './TaskDetailsDrawer';

const CustomNoRowsOverlay = () => (
  <GridOverlay>
    <Typography color="text.secondary">No tasks found</Typography>
  </GridOverlay>
);

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

const TaskList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items, total, loading, error, successMessage } = useSelector((state: RootState) => state.task);
  const { items: employees } = useSelector((state: RootState) => state.employee);

  const isAdmin = user?.role === 'ADMIN';

  // DataGrid State
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [searchValue, setSearchValue] = useState('');
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');

  // Dialog States
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { page, pageSize } = paginationModel;
  const sortField = sortModel[0]?.field;
  const sortOrder = sortModel[0]?.sort;

  const fetchParams = React.useMemo(() => ({
    page: page + 1,
    limit: pageSize,
    search: searchValue,
    status: statusFilter,
    priority: priorityFilter,
    employeeId: employeeFilter ? parseInt(employeeFilter, 10) : undefined,
    sort: sortField,
    order: sortOrder as 'asc' | 'desc' | undefined,
  }), [page, pageSize, searchValue, statusFilter, priorityFilter, employeeFilter, sortField, sortOrder]);

  useEffect(() => {
    const promise = dispatch(fetchTasks(fetchParams));
    return () => {
      promise.abort();
    };
  }, [dispatch, fetchParams]);

  useEffect(() => {
    if (isAdmin) {
      const promise = dispatch(fetchEmployees({ limit: 500 }));
      return () => {
        promise.abort();
      };
    }
  }, [dispatch, isAdmin]);

  // Handle Search Debounce
  const debouncedSearch = React.useMemo(
    () =>
      debounce((value: string) => {
        setSearchValue(value);
        setPaginationModel(prev => ({ ...prev, page: 0 }));
      }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleRefresh = useCallback(() => {
    dispatch(fetchTasks(fetchParams));
  }, [dispatch, fetchParams]);

  const handleOpenForm = useCallback((task?: Task) => {
    setSelectedTask(task || null);
    setFormOpen(true);
  }, []);

  const handleOpenDelete = useCallback((task: Task) => {
    setSelectedTask(task);
    setDeleteOpen(true);
  }, []);

  const handleOpenDrawer = useCallback((task: Task) => {
    setSelectedTask(task);
    setDrawerOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => setFormOpen(false), []);
  const handleCloseDelete = useCallback(() => setDeleteOpen(false), []);
  const handleCloseDrawer = useCallback(() => setDrawerOpen(false), []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', flex: 1, minWidth: 200 },
    { 
      field: 'assigned_employee_name', 
      headerName: 'Assigned Employee', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">{params.row.assigned_employee_name || `ID: ${params.row.assigned_employee_id}`}</Typography>
      )
    },
    { 
      field: 'priority', 
      headerName: 'Priority', 
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={params.value} 
          color={getPriorityColor(params.value)} 
          size="small" 
          variant="outlined"
          sx={{ fontWeight: 600, borderRadius: 2 }}
        />
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={params.value} 
          color={getStatusColor(params.value)} 
          size="small" 
          sx={{ fontWeight: 600, borderRadius: 2 }}
        />
      )
    },
    { 
      field: 'start_date', 
      headerName: 'Start Date', 
      width: 120,
      renderCell: (params: GridRenderCellParams) => new Date(params.value).toLocaleDateString()
    },
    { 
      field: 'due_date', 
      headerName: 'Due Date', 
      width: 120,
      renderCell: (params: GridRenderCellParams) => new Date(params.value).toLocaleDateString()
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => handleOpenDrawer(params.row as Task)} color="info">
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {isAdmin && (
            <>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => handleOpenForm(params.row as Task)} color="primary">
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={() => handleOpenDelete(params.row as Task)} color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <PageContainer title="Task Management" disablePaper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight={800} color="text.primary">
          Tasks
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
            Refresh
          </Button>
          {isAdmin && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
              Add Task
            </Button>
          )}
        </Box>
      </Box>

      {error ? (
        <Paper elevation={0} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Alert severity="error" sx={{ mb: 3, width: '100%', maxWidth: 600 }}>
            {error === 'Forbidden' || error.includes('403') || error.includes('Permission') 
              ? 'Permission Denied: You do not have access to view this data.'
              : error}
          </Alert>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
            Retry
          </Button>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ p: 0, overflow: 'hidden', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '100%' }}>
          <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <TextField
              placeholder="Search by Title, Employee..."
              variant="outlined"
              size="small"
              onChange={handleSearchChange}
              sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 250 }, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }
              }}
            />
            <TextField
              select
              label="Status"
              size="small"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPaginationModel(prev => ({ ...prev, page: 0 }));
              }}
              sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 150 }, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </TextField>
            <TextField
              select
              label="Priority"
              size="small"
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPaginationModel(prev => ({ ...prev, page: 0 }));
              }}
              sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 150 }, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              <MenuItem value="">All Priorities</MenuItem>
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </TextField>
            {isAdmin && (
              <TextField
                select
                label="Employee"
                size="small"
                value={employeeFilter}
                onChange={(e) => {
                  setEmployeeFilter(e.target.value);
                  setPaginationModel(prev => ({ ...prev, page: 0 }));
                }}
                sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 150 }, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                <MenuItem value="">All Employees</MenuItem>
                {employees.map(emp => (
                  <MenuItem key={emp.id} value={emp.id.toString()}>{emp.full_name}</MenuItem>
                ))}
              </TextField>
            )}
          </Box>

          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={items}
              columns={columns}
              rowCount={total}
              loading={loading}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              sortModel={sortModel}
              onSortModelChange={setSortModel}
              paginationMode="server"
              sortingMode="server"
              pageSizeOptions={[5, 10, 25, 50]}
              disableRowSelectionOnClick
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
              }}
              sx={{
                border: 0,
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'background.default',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                },
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'action.hover',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: '1px solid rgba(0,0,0,0.05)',
                }
              }}
            />
          </Box>
        </Paper>
      )}

      {isAdmin && (
        <>
          <TaskFormDialog 
            open={formOpen} 
            onClose={handleCloseForm} 
            task={selectedTask}
            onSuccess={handleRefresh}
          />
          <TaskDeleteDialog
            open={deleteOpen}
            onClose={handleCloseDelete}
            task={selectedTask}
            onSuccess={handleRefresh}
          />
        </>
      )}

      <TaskDetailsDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        task={selectedTask}
      />

      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={4000} 
        onClose={() => dispatch(clearTaskMessages())}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => dispatch(clearTaskMessages())} sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default TaskList;
