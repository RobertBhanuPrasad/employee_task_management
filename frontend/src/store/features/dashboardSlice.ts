import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { dashboardService } from '../../services/dashboard.service';
import type { AdminDashboardData, EmployeeDashboardData } from '../../services/dashboard.service';

interface DashboardState {
  adminData: AdminDashboardData | null;
  employeeData: EmployeeDashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  adminData: null,
  employeeData: null,
  loading: false,
  error: null,
};

export const fetchAdminDashboard = createAsyncThunk(
  'dashboard/fetchAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getAdminDashboard();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin dashboard');
    }
  }
);

export const fetchEmployeeDashboard = createAsyncThunk(
  'dashboard/fetchEmployee',
  async (_, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getEmployeeDashboard();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee dashboard');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardData: (state) => {
      state.adminData = null;
      state.employeeData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action: PayloadAction<AdminDashboardData>) => {
        state.loading = false;
        state.adminData = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchEmployeeDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeDashboard.fulfilled, (state, action: PayloadAction<EmployeeDashboardData>) => {
        state.loading = false;
        state.employeeData = action.payload;
      })
      .addCase(fetchEmployeeDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
