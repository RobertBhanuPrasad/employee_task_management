import { Router } from 'express';
import authController from '../controllers/authController';
import { registerValidator, loginValidator } from '../validators/authValidator';
import { validateRequest } from '../middlewares/validationMiddleware';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', registerValidator, validateRequest, authController.register);
router.post('/login', loginValidator, validateRequest, authController.login);
router.post('/logout', authenticate, authController.logout);

export default router;
