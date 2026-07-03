import uploadRepository from '../repositories/uploadRepository';
import taskRepository from '../repositories/taskRepository';
import ApiError from '../utils/ApiError';
import { JwtPayload } from '../utils/jwt';
import fs from 'fs';
import path from 'path';

export class UploadService {
  
  private formatFileResponse(file: any, reqHost?: string) {
    return {
      id: file.id,
      original_name: file.original_name,
      file_type: file.file_type,
      file_size: file.file_size,
      uploaded_at: file.uploaded_at,
      download_url: `/api/v1/uploads/${file.id}/download`
    };
  }

  async uploadFile(taskId: number, file: Express.Multer.File, user: JwtPayload) {
    if (user.role !== 'ADMIN') {
      // Clean up file if admin check fails (though controller might handle this via middleware)
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      throw new ApiError(403, 'Only Admin can upload files.');
    }

    const taskExists = await taskRepository.taskExists(taskId);
    if (!taskExists) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      throw new ApiError(404, 'Task not found');
    }

    const fileData = {
      task_id: taskId,
      file_name: file.filename,
      original_name: file.originalname,
      file_path: file.path,
      file_type: file.mimetype,
      file_size: file.size
    };

    const newId = await uploadRepository.uploadFile(fileData);
    const savedFile = await uploadRepository.getFileById(newId);
    
    return this.formatFileResponse(savedFile);
  }

  async getTaskFiles(taskId: number, user: JwtPayload) {
    const task = await taskRepository.getTaskById(taskId);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    if (user.role === 'EMPLOYEE' && task.assigned_employee_id !== user.id) {
      throw new ApiError(403, 'You do not have permission to view files for this task');
    }

    const files = await uploadRepository.getTaskFiles(taskId);
    return files.map(file => this.formatFileResponse(file));
  }

  async downloadFile(id: number, user: JwtPayload) {
    const file = await uploadRepository.getFileById(id);
    if (!file) {
      throw new ApiError(404, 'File not found');
    }

    // Verify task permission
    if (user.role === 'EMPLOYEE') {
      const task = await taskRepository.getTaskById(file.task_id);
      if (!task || task.assigned_employee_id !== user.id) {
        throw new ApiError(403, 'You do not have permission to download this file');
      }
    }

    if (!fs.existsSync(file.file_path)) {
      throw new ApiError(404, 'Physical file not found on disk');
    }

    return { filePath: file.file_path, originalName: file.original_name };
  }

  async deleteFile(id: number, user: JwtPayload) {
    if (user.role !== 'ADMIN') {
      throw new ApiError(403, 'Only Admin can delete files.');
    }

    const file = await uploadRepository.getFileById(id);
    if (!file) {
      throw new ApiError(404, 'File not found');
    }

    // Attempt to delete physical file if it exists
    if (fs.existsSync(file.file_path)) {
      try {
        fs.unlinkSync(file.file_path);
      } catch (err) {
        console.error('Failed to delete physical file:', err);
      }
    }

    // Delete db record safely
    await uploadRepository.deleteFile(id);
    return true;
  }
}

export default new UploadService();
