import { Router } from 'express';
import taskController from '../controllers/taskController';
import { authenticate } from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/roleMiddleware';
import { validateRequest } from '../middlewares/validationMiddleware';
import { createTaskValidator, updateTaskValidator } from '../validators/taskValidator';

const router = Router();

// Apply authentication to all task routes
router.use(authenticate);

// View tasks (accessible to both ADMIN and EMPLOYEE)
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);

// Create, Update, Delete (accessible only to ADMIN)
router.post(
  '/', 
  authorizeRole('ADMIN'), 
  createTaskValidator, 
  validateRequest, 
  taskController.createTask
);

router.put(
  '/:id', 
  authorizeRole('ADMIN'), 
  updateTaskValidator, 
  validateRequest, 
  taskController.updateTask
);

router.delete('/:id', authorizeRole('ADMIN'), taskController.deleteTask);

export default router;
