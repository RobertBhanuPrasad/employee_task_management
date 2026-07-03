import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';
import { verifyToken, JwtPayload } from '../utils/jwt';

// Extend Express Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized to access this route. Missing Token.'));
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Not authorized to access this route. Invalid or Expired Token.'));
  }
});
