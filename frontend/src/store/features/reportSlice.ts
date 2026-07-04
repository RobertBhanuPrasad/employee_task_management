import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { reportService } from '../../services/report.service';
import type { 
  ReportFilters, 
  CompletedTaskRow, 
  PendingTaskRow, 
  EmployeeWiseRow 
} from '../../services/report.service';

interface ReportState {
  completedTasks: CompletedTaskRow[];
  pendingTasks: PendingTaskRow[];
  employeeWise: EmployeeWiseRow[];
  loading: boolean;
  exportLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ReportState = {
  completedTasks: [],
  pendingTasks: [],
  employeeWise: [],
  loading: false,
  exportLoading: false,
  error: null,
  successMessage: null,
};

export const fetchCompletedTasksReport = createAsyncThunk(
  'report/fetchCompletedTasks',
  async (filters: ReportFilters = {}, { rejectWithValue }) => {
    try {
      const data = await reportService.getCompletedTasks(filters);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch completed tasks report');
    }
  }
);

export const fetchPendingTasksReport = createAsyncThunk(
  'report/fetchPendingTasks',
  async (filters: ReportFilters = {}, { rejectWithValue }) => {
    try {
      const data = await reportService.getPendingTasks(filters);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending tasks report');
    }
  }
);

export const fetchEmployeeWiseReport = createAsyncThunk(
  'report/fetchEmployeeWise',
  async (filters: ReportFilters = {}, { rejectWithValue }) => {
    try {
      const data = await reportService.getEmployeeWise(filters);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee-wise report');
    }
  }
);

export const exportReportData = createAsyncThunk(
  'report/export',
  async (
    { type, format, filters = {} }: { type: 'completed' | 'pending' | 'employee-wise'; format: 'csv' | 'excel'; filters?: ReportFilters },
    { rejectWithValue }
  ) => {
    try {
      const blob = await reportService.exportReport(type, format, filters);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const extension = format === 'csv' ? 'csv' : 'xlsx';
      link.setAttribute('download', `${type}_report.${extension}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return `Successfully exported ${type} report as ${format.toUpperCase()}`;
    } catch {
      return rejectWithValue('Failed to export report');
    }
  }
);

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    clearReportMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Completed
      .addCase(fetchCompletedTasksReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompletedTasksReport.fulfilled, (state, action: PayloadAction<CompletedTaskRow[]>) => {
        state.loading = false;
        state.completedTasks = action.payload || [];
      })
      .addCase(fetchCompletedTasksReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Pending
      .addCase(fetchPendingTasksReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingTasksReport.fulfilled, (state, action: PayloadAction<PendingTaskRow[]>) => {
        state.loading = false;
        state.pendingTasks = action.payload || [];
      })
      .addCase(fetchPendingTasksReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Employee Wise
      .addCase(fetchEmployeeWiseReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeWiseReport.fulfilled, (state, action: PayloadAction<EmployeeWiseRow[]>) => {
        state.loading = false;
        state.employeeWise = action.payload || [];
      })
      .addCase(fetchEmployeeWiseReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Export
      .addCase(exportReportData.pending, (state) => {
        state.exportLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(exportReportData.fulfilled, (state, action: PayloadAction<string>) => {
        state.exportLoading = false;
        state.successMessage = action.payload;
      })
      .addCase(exportReportData.rejected, (state, action) => {
        state.exportLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearReportMessages } = reportSlice.actions;
export default reportSlice.reducer;
