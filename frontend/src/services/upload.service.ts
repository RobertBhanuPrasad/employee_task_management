import api from './api';

export interface UploadedFile {
  id: number;
  original_name: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
  download_url: string;
}

class UploadService {
  async getTaskFiles(taskId: number): Promise<UploadedFile[]> {
    const response = await api.get(`/v1/uploads/task/${taskId}`);
    return response.data.data;
  }

  async uploadFile(taskId: number, file: File, onUploadProgress?: (progressEvent: any) => void): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/v1/uploads/${taskId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
    return response.data.data;
  }

  async deleteFile(id: number): Promise<void> {
    await api.delete(`/v1/uploads/${id}`);
  }

  async downloadFile(id: number, originalName: string): Promise<void> {
    const response = await api.get(`/v1/uploads/${id}/download`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', originalName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export const uploadService = new UploadService();
