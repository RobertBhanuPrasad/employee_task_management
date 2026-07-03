import { Router } from 'express';
import notificationController from '../controllers/notificationController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/read-all', notificationController.markAllRead);
router.patch('/:id/read', notificationController.markRead);
router.delete('/:id', notificationController.deleteNotification);

// Testing endpoint for due-tomorrow trigger
router.post('/trigger-due-tomorrow', notificationController.createDueTomorrowNotifications);
router.post('/trigger-task-assigned', notificationController.triggerTaskAssigned);
router.post('/trigger-task-completed', notificationController.triggerTaskCompleted);

export default router;
