import { Router } from 'express';
import uploadController from '../controllers/uploadController';
import { authenticate } from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/roleMiddleware';
import { uploadMiddleware } from '../middlewares/uploadMiddleware';

const router = Router();

router.use(authenticate);

// Admin only upload
router.post('/:taskId', authorizeRole('ADMIN'), uploadMiddleware.single('file'), uploadController.uploadFile);

// Get all files for a task (Admin can view all, Employee is restricted in service)
router.get('/task/:taskId', uploadController.getTaskFiles);

// Download file
router.get('/:id/download', uploadController.downloadFile);

// Delete file (Admin only)
router.delete('/:id', authorizeRole('ADMIN'), uploadController.deleteFile);

export default router;
