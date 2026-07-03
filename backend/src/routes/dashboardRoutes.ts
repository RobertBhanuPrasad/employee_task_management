import { Router } from 'express';
import dashboardController from '../controllers/dashboardController';
import { authenticate } from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/roleMiddleware';

const router = Router();

// Ensure all dashboard routes are authenticated
router.use(authenticate);

// Admin dashboard route - strictly for ADMIN
router.get(
  '/admin', 
  authorizeRole('ADMIN'), 
  dashboardController.getAdminDashboard
);

// Employee dashboard route - strictly for EMPLOYEE
router.get(
  '/employee', 
  authorizeRole('EMPLOYEE'), 
  dashboardController.getEmployeeDashboard
);

export default router;
