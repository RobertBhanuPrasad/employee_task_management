import app from './app';
import { config } from './config/env';
import { testConnection } from './database/connection';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    // Test Database Connection
    await testConnection();

    // Start Express Server
    app.listen(config.port, () => {
      console.log('Server running successfully');
      logger.info(`Server listening on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
