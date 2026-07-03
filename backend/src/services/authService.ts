import bcrypt from 'bcrypt';
import authRepository from '../repositories/authRepository';
import { generateToken } from '../utils/jwt';
import ApiError from '../utils/ApiError';

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async register(userData: any) {
    const existingUser = await authRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ApiError(409, 'Email is already registered');
    }

    const hashedPassword = await this.hashPassword(userData.password);
    
    const newUserId = await authRepository.createUser({
      ...userData,
      password: hashedPassword
    });

    return { id: newUserId };
  }

  async login(email: string, password: string, rememberMe: boolean = false) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    }, rememberMe);

    // Sanitize user object before returning
    const { password: _, ...sanitizedUser } = user as any;

    return { token, user: sanitizedUser };
  }

  async logout() {
    // Since JWT is stateless, server-side logout usually involves client clearing the token.
    // In production, we would add the token to a Redis blacklist or use a refresh token strategy
    // where we invalidate the refresh token in the database.
    return true;
  }
}

export default new AuthService();
