export interface CreateTaskDto {
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  start_date: string;
  due_date: string;
  assigned_employee_id: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  start_date?: string;
  due_date?: string;
  assigned_employee_id?: number;
}
