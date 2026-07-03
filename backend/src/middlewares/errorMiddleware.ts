import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import { logger } from '../utils/logger';
import { config } from '../config/env';

export const globalErrorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: any[] = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else {
    // Handling generic or unhandled errors
    message = err.message || message;
  }

  // Log the error
  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  if (config.nodeEnv === 'development') {
    logger.error(err.stack || '');
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
