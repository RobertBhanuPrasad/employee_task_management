import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import uploadService from '../services/uploadService';
import { sendSuccessResponse } from '../utils/responseHelper';
import ApiError from '../utils/ApiError';

class UploadController {
  uploadFile = asyncHandler(async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.taskId as string, 10);
    
    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }

    const data = await uploadService.uploadFile(taskId, req.file, req.user!);
    return sendSuccessResponse(res, 201, 'File uploaded successfully', data);
  });

  getTaskFiles = asyncHandler(async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.taskId as string, 10);
    const data = await uploadService.getTaskFiles(taskId, req.user!);
    return sendSuccessResponse(res, 200, 'Files fetched successfully', data);
  });

  downloadFile = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const { filePath, originalName } = await uploadService.downloadFile(id, req.user!);
    
    res.download(filePath, originalName, (err) => {
      if (err) {
        if (!res.headersSent) {
          res.status(500).json({ success: false, message: 'Failed to download file' });
        }
      }
    });
  });

  deleteFile = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    await uploadService.deleteFile(id, req.user!);
    return sendSuccessResponse(res, 200, 'File deleted successfully', {});
  });
}

export default new UploadController();
