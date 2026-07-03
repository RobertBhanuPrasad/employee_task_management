import { Router } from 'express';
import reportController from '../controllers/reportController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

// JSON Reports
router.get('/completed', reportController.getCompletedTasks);
router.get('/pending', reportController.getPendingTasks);
router.get('/employee-wise', reportController.getEmployeeWiseReport);

// CSV Exports
router.get('/completed/export/csv', reportController.exportCompletedCSV);
router.get('/pending/export/csv', reportController.exportPendingCSV);
router.get('/employee-wise/export/csv', reportController.exportEmployeeCSV);

// Excel Exports
router.get('/completed/export/excel', reportController.exportCompletedExcel);
router.get('/pending/export/excel', reportController.exportPendingExcel);
router.get('/employee-wise/export/excel', reportController.exportEmployeeExcel);

export default router;
