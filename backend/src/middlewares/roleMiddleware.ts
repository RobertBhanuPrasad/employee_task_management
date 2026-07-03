import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';

export const authorizeRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Authorization logic will be implemented here
    // Check if req.user exists and has the required role
    // if (!req.user || !roles.includes(req.user.role)) {
    //   return next(new ApiError(403, 'You do not have permission to perform this action'));
    // }
    next();
  };
};
