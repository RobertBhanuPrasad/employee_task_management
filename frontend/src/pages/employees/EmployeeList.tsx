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
  Alert
} from '@mui/material';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';

import PageContainer from '../../components/common/PageContainer';
import type { AppDispatch, RootState } from '../../store';
import { fetchEmployees, clearEmployeeMessages } from '../../store/features/employeeSlice';
import type { Employee } from '../../services/employee.service';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';

import EmployeeFormDialog from './EmployeeFormDialog';
import EmployeeDeleteDialog from './EmployeeDeleteDialog';
import EmployeeDetailsDrawer from './EmployeeDetailsDrawer';

const CustomNoRowsOverlay = () => (
  <GridOverlay>
    <Typography color="text.secondary">No employees found</Typography>
  </GridOverlay>
);

const EmployeeList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items, total, loading, error, successMessage } = useSelector((state: RootState) => state.employee);

  const isAdmin = user?.role === 'ADMIN';

  // DataGrid State
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [searchValue, setSearchValue] = useState('');

  // Dialog States
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const fetchParams = useCallback(() => {
    return {
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      search: searchValue,
      sort: sortModel[0]?.field,
      order: sortModel[0]?.sort as 'asc' | 'desc' | undefined,
    };
  }, [paginationModel, sortModel, searchValue]);

  useEffect(() => {
    dispatch(fetchEmployees(fetchParams()));
  }, [dispatch, fetchParams]);

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

  const handleRefresh = () => {
    dispatch(fetchEmployees(fetchParams()));
  };

  const handleOpenForm = (employee?: Employee) => {
    setSelectedEmployee(employee || null);
    setFormOpen(true);
  };

  const handleOpenDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteOpen(true);
  };

  const handleOpenDrawer = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDrawerOpen(true);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'full_name', headerName: 'Full Name', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={params.value} 
          color={params.value === 'ADMIN' ? 'secondary' : 'primary'} 
          size="small" 
        />
      )
    },
    { field: 'department', headerName: 'Department', flex: 1, minWidth: 150 },
    { field: 'designation', headerName: 'Designation', flex: 1, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => handleOpenDrawer(params.row as Employee)} color="info">
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {isAdmin && (
            <>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => handleOpenForm(params.row as Employee)} color="primary">
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={() => handleOpenDelete(params.row as Employee)} color="error">
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
    <PageContainer title="Employee Management">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          Employees
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
            Refresh
          </Button>
          {isAdmin && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
              Add Employee
            </Button>
          )}
        </Box>
      </Box>

      {error ? (
        <Paper elevation={1} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
        <Paper elevation={1} sx={{ p: 0, overflow: 'hidden' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderBottom: 1, borderColor: 'divider' }}>
            <TextField
              placeholder="Search by Name, Email, Department..."
              variant="outlined"
              size="small"
              onChange={handleSearchChange}
              sx={{ width: { xs: '100%', sm: 350 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
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
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
            />
          </Box>
        </Paper>
      )}

      {isAdmin && (
        <>
          <EmployeeFormDialog 
            open={formOpen} 
            onClose={() => setFormOpen(false)} 
            employee={selectedEmployee}
            onSuccess={handleRefresh}
          />
          <EmployeeDeleteDialog
            open={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            employee={selectedEmployee}
          />
        </>
      )}

      <EmployeeDetailsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        employee={selectedEmployee}
      />

      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={4000} 
        onClose={() => dispatch(clearEmployeeMessages())}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => dispatch(clearEmployeeMessages())} sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default EmployeeList;
