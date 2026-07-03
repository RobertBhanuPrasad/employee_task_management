import { Router } from 'express';
import userController from '../controllers/userController';
import { authenticate } from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/roleMiddleware';
import { createEmployeeValidator, updateEmployeeValidator } from '../validators/userValidator';
import { validateRequest } from '../middlewares/validationMiddleware';

const router = Router();

// Apply authentication to all employee routes
router.use(authenticate);
// Apply ADMIN authorization to all employee routes as per requirement "Admin Only"
router.use(authorizeRole('ADMIN'));

router.get('/', userController.getAllEmployees);
router.get('/:id', userController.getEmployeeById);

router.post(
  '/', 
  createEmployeeValidator, 
  validateRequest, 
  userController.createEmployee
);

router.put(
  '/:id', 
  updateEmployeeValidator, 
  validateRequest, 
  userController.updateEmployee
);

router.delete('/:id', userController.deleteEmployee);

export default router;
