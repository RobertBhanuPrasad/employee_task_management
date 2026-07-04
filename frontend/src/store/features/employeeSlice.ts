import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { employeeService } from '../../services/employee.service';
import type { 
  Employee, 
  PaginatedEmployees,
  EmployeeFilters, 
  CreateEmployeePayload, 
  UpdateEmployeePayload 
} from '../../services/employee.service';

interface EmployeeState {
  items: Employee[];
  total: number;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  actionError: string | null;
  successMessage: string | null;
}

const initialState: EmployeeState = {
  items: [],
  total: 0,
  loading: false,
  actionLoading: false,
  error: null,
  actionError: null,
  successMessage: null,
};

export const fetchEmployees = createAsyncThunk(
  'employee/fetchAll',
  async (filters: EmployeeFilters, { rejectWithValue }) => {
    try {
      const data = await employeeService.getEmployees(filters);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employees');
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employee/create',
  async (payload: CreateEmployeePayload, { rejectWithValue }) => {
    try {
      const data = await employeeService.createEmployee(payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create employee');
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employee/update',
  async ({ id, payload }: { id: number; payload: UpdateEmployeePayload }, { rejectWithValue }) => {
    try {
      const data = await employeeService.updateEmployee(id, payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update employee');
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employee/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await employeeService.deleteEmployee(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete employee');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    clearEmployeeMessages: (state) => {
      state.successMessage = null;
      state.actionError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action: PayloadAction<PaginatedEmployees>) => {
        state.loading = false;
        state.items = action.payload?.employees || [];
        state.total = action.payload?.pagination?.totalRecords || 0;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Employee
      .addCase(createEmployee.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(createEmployee.fulfilled, (state) => {
        state.actionLoading = false;
        state.successMessage = 'Employee created successfully';
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload as string;
      })
      // Update Employee
      .addCase(updateEmployee.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(updateEmployee.fulfilled, (state) => {
        state.actionLoading = false;
        state.successMessage = 'Employee updated successfully';
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload as string;
      })
      // Delete Employee
      .addCase(deleteEmployee.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action: PayloadAction<number>) => {
        state.actionLoading = false;
        state.items = state.items.filter(emp => emp.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
        state.successMessage = 'Employee deleted successfully';
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload as string;
      });
  }
});

export const { clearEmployeeMessages } = employeeSlice.actions;
export default employeeSlice.reducer;
