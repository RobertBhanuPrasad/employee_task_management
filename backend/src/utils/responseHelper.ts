import { Response } from 'express';
import ApiResponse from './ApiResponse';

export const sendSuccessResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T
) => {
  const response = new ApiResponse<T>(statusCode, data, message);
  return res.status(statusCode).json(response);
};
