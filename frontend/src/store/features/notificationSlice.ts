import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { notificationService } from '../../services/notification.service';
import type { PaginatedNotifications, Notification } from '../../services/notification.service';

interface NotificationState {
  items: Notification[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notification/fetch',
  async ({ page = 1, limit = 5 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const data = await notificationService.getNotifications(page, limit);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<PaginatedNotifications>) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.meta.total;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default notificationSlice.reducer;
