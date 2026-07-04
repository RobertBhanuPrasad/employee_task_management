import cron from 'node-cron';
import notificationService from '../services/notificationService';
import { logger } from './logger';

export const initScheduler = () => {
  // Run every day at 00:00 (Midnight)
  cron.schedule('0 0 * * *', async () => {
    logger.info('Running daily due tomorrow notifications scheduler...');
    try {
      const createdCount = await notificationService.createDueTomorrowNotifications();
      logger.info(`Successfully generated ${createdCount} due tomorrow notifications.`);
    } catch (error) {
      logger.error('Failed to run daily notification scheduler:', error);
    }
  });

  logger.info('Cron scheduler initialized successfully.');
};
