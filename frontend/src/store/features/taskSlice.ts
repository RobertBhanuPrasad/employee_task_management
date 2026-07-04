import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { taskService } from '../../services/task.service';
import type { 
  Task, 
  PaginatedTasks,
  TaskFilters, 
  CreateTaskPayload, 
  UpdateTaskPayload 
} from '../../services/task.service';

interface TaskState {
  items: Task[];
  total: number;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  actionError: string | null;
  successMessage: string | null;
}

const initialState: TaskState = {
  items: [],
  total: 0,
  loading: false,
  actionLoading: false,
  error: null,
  actionError: null,
  successMessage: null,
};

export const fetchTasks = createAsyncThunk(
  'task/fetchAll',
  async (filters: TaskFilters, { rejectWithValue }) => {
    try {
      const data = await taskService.getTasks(filters);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'task/create',
  async (payload: CreateTaskPayload, { rejectWithValue }) => {
    try {
      const data = await taskService.createTask(payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'task/update',
  async ({ id, payload }: { id: number; payload: UpdateTaskPayload }, { rejectWithValue }) => {
    try {
      const data = await taskService.updateTask(id, payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'task/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
    }
  }
);

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    clearTaskMessages: (state) => {
      state.successMessage = null;
      state.actionError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<PaginatedTasks>) => {
        state.loading = false;
        state.items = action.payload?.tasks || [];
        state.total = action.payload?.pagination?.totalRecords || 0;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(createTask.fulfilled, (state) => {
        state.actionLoading = false;
        state.successMessage = 'Task created successfully';
      })
      .addCase(createTask.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload as string;
      })
      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(updateTask.fulfilled, (state) => {
        state.actionLoading = false;
        state.successMessage = 'Task updated successfully';
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload as string;
      })
      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.actionLoading = false;
        state.items = state.items.filter(task => task.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
        state.successMessage = 'Task deleted successfully';
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload as string;
      });
  }
});

export const { clearTaskMessages } = taskSlice.actions;
export default taskSlice.reducer;
