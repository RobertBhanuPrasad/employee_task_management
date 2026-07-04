import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { uploadService } from '../../services/upload.service';
import type { UploadedFile } from '../../services/upload.service';

interface UploadState {
  items: UploadedFile[];
  loading: boolean;
  uploading: boolean;
  uploadProgress: number;
  actionLoading: boolean;
  error: string | null;
  actionError: string | null;
  successMessage: string | null;
}

const initialState: UploadState = {
  items: [],
  loading: false,
  uploading: false,
  uploadProgress: 0,
  actionLoading: false,
  error: null,
  actionError: null,
  successMessage: null,
};

export const fetchTaskFiles = createAsyncThunk(
  'upload/fetchTaskFiles',
  async (taskId: number, { rejectWithValue }) => {
    try {
      const data = await uploadService.getTaskFiles(taskId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch task files');
    }
  }
);

export const uploadFile = createAsyncThunk(
  'upload/uploadFile',
  async ({ taskId, file, onProgress }: { taskId: number; file: File; onProgress?: (p: number) => void }, { rejectWithValue }) => {
    try {
      const data = await uploadService.uploadFile(taskId, file, (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (onProgress) onProgress(percentCompleted);
        }
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload file');
    }
  }
);

export const deleteFile = createAsyncThunk(
  'upload/deleteFile',
  async (id: number, { rejectWithValue }) => {
    try {
      await uploadService.deleteFile(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete file');
    }
  }
);

export const downloadFile = createAsyncThunk(
  'upload/downloadFile',
  async ({ id, originalName }: { id: number; originalName: string }, { rejectWithValue }) => {
    try {
      await uploadService.downloadFile(id, originalName);
      return id;
    } catch (error: any) {
      return rejectWithValue('Failed to download file');
    }
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    clearUploadMessages: (state) => {
      state.successMessage = null;
      state.actionError = null;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Files
      .addCase(fetchTaskFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskFiles.fulfilled, (state, action: PayloadAction<UploadedFile[]>) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchTaskFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Upload File
      .addCase(uploadFile.pending, (state) => {
        state.uploading = true;
        state.uploadProgress = 0;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(uploadFile.fulfilled, (state, action: PayloadAction<UploadedFile>) => {
        state.uploading = false;
        state.uploadProgress = 100;
        state.items.unshift(action.payload);
        state.successMessage = 'File uploaded successfully';
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 0;
        state.actionError = action.payload as string;
      })
      
      // Delete File
      .addCase(deleteFile.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteFile.fulfilled, (state, action: PayloadAction<number>) => {
        state.actionLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.successMessage = 'File deleted successfully';
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload as string;
      });
  }
});

export const { clearUploadMessages, setUploadProgress } = uploadSlice.actions;
export default uploadSlice.reducer;
