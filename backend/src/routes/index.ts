import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import taskRoutes from './taskRoutes';
import dashboardRoutes from './dashboardRoutes';
import reportRoutes from './reportRoutes';
import uploadRoutes from './uploadRoutes';
import notificationRoutes from './notificationRoutes';

const router = Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/tasks',
    route: taskRoutes,
  },
  {
    path: '/dashboard',
    route: dashboardRoutes,
  },
  {
    path: '/reports',
    route: reportRoutes,
  },
  {
    path: '/uploads',
    route: uploadRoutes,
  },
  {
    path: '/notifications',
    route: notificationRoutes,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
