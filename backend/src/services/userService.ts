import bcrypt from 'bcrypt';
import userRepository from '../repositories/userRepository';
import ApiError from '../utils/ApiError';

export class UserService {
  async getAllEmployees(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    sortOrder: string
  ) {
    return userRepository.findAll(page, limit, search, sortBy, sortOrder);
  }

  async getEmployeeById(id: number) {
    const employee = await userRepository.findById(id);
    if (!employee) {
      throw new ApiError(404, 'Employee not found');
    }
    return employee;
  }

  async createEmployee(employeeData: any) {
    const existingUser = await userRepository.findByEmail(employeeData.email);
    if (existingUser) {
      throw new ApiError(409, 'Email is already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(employeeData.password, salt);
    
    const newEmployeeId = await userRepository.create({
      ...employeeData,
      password: hashedPassword
    });

    return await userRepository.findById(newEmployeeId);
  }

  async updateEmployee(id: number, employeeData: any) {
    const existingEmployee = await userRepository.findById(id);
    if (!existingEmployee) {
      throw new ApiError(404, 'Employee not found');
    }

    await userRepository.update(id, employeeData);
    
    return await userRepository.findById(id);
  }

  async deleteEmployee(id: number) {
    const existingEmployee = await userRepository.findById(id);
    if (!existingEmployee) {
      throw new ApiError(404, 'Employee not found');
    }

    await userRepository.delete(id);
    return true;
  }
}

export default new UserService();
