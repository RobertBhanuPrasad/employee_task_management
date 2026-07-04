import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { notificationService } from '../../services/notification.service';
import type { PaginatedNotifications, Notification } from '../../services/notification.service';

interface NotificationState {
  items: Notification[];
  total: number;
  unreadCount: number;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  actionError: string | null;
  successMessage: string | null;
}

const initialState: NotificationState = {
  items: [],
  total: 0,
  unreadCount: 0,
  loading: false,
  actionLoading: false,
  error: null,
  actionError: null,
  successMessage: null,
};

export const fetchNotifications = createAsyncThunk(
  'notification/fetch',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const data = await notificationService.getNotifications(page, limit);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notification/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const count = await notificationService.getUnreadCount();
      return count;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (id: number, { rejectWithValue }) => {
    try {
      await notificationService.markRead(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllRead();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearNotificationMessages: (state) => {
      state.successMessage = null;
      state.actionError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<PaginatedNotifications>) => {
        state.loading = false;
        state.items = action.payload?.notifications || [];
        state.total = action.payload?.pagination?.totalRecords || 0;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Unread Count
      .addCase(fetchUnreadCount.fulfilled, (state, action: PayloadAction<number>) => {
        state.unreadCount = action.payload;
      })
      // Mark As Read
      .addCase(markAsRead.fulfilled, (state, action: PayloadAction<number>) => {
        const id = action.payload;
        const index = state.items.findIndex(item => item.id === id);
        if (index !== -1 && !state.items[index].is_read) {
          state.items[index].is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // Mark All As Read
      .addCase(markAllAsRead.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.actionLoading = false;
        state.items.forEach(item => { item.is_read = true; });
        state.unreadCount = 0;
        state.successMessage = 'All notifications marked as read';
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload as string;
      });
  }
});

export const { clearNotificationMessages } = notificationSlice.actions;

export default notificationSlice.reducer;
