import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import authService from '../services/authService';
import { sendSuccessResponse } from '../utils/responseHelper';

class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    await authService.register(req.body);
    return sendSuccessResponse(res, 201, 'Registration successful', {});
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, rememberMe } = req.body;
    const result = await authService.login(email, password, rememberMe);
    return sendSuccessResponse(res, 200, 'Login Successful', result);
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    await authService.logout();
    return sendSuccessResponse(res, 200, 'Logout Successful', {});
  });
}

export default new AuthController();
