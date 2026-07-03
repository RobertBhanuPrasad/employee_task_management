import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';

// Extend Express Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace 'any' with specific User interface later
    }
  }
}

export const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Authentication logic will be implemented here
  // Check for JWT token in headers or cookies
  // Verify token
  // Attach user to req.user
  next();
});
