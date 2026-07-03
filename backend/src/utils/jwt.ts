import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export const generateToken = (payload: JwtPayload, rememberMe: boolean = false): string => {
  const expiresIn = rememberMe ? '30d' : config.jwt.expiresIn;
  return jwt.sign(payload, config.jwt.secret, { expiresIn: expiresIn as any });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};
