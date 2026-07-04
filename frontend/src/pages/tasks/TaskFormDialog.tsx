import React, { useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  MenuItem,
  Grid,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { createTask, updateTask, clearTaskMessages } from '../../store/features/taskSlice';
import { fetchEmployees } from '../../store/features/employeeSlice';
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../../services/task.service';
import dayjs from 'dayjs';

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], { required_error: 'Priority is required' }),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'], { required_error: 'Status is required' }),
  start_date: z.string().min(1, 'Start date is required'),
  due_date: z.string().min(1, 'Due date is required'),
  assigned_employee_id: z.number({ required_error: 'Assigned employee is required', invalid_type_error: 'Assigned employee is required' }).min(1, 'Assigned employee is required')
}).refine((data) => {
  if (data.start_date && data.due_date) {
    return dayjs(data.due_date).isSame(dayjs(data.start_date), 'day') || dayjs(data.due_date).isAfter(dayjs(data.start_date), 'day');
  }
  return true;
}, {
  message: "Due date cannot be earlier than start date",
  path: ["due_date"]
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  onSuccess?: () => void;
}

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({ open, onClose, task, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { actionLoading, actionError, successMessage } = useSelector((state: RootState) => state.task);
  const { items: employees, loading: employeesLoading } = useSelector((state: RootState) => state.employee);
  const isEdit = !!task;
  
  // Disable editing if backend enforces completed tasks cannot be edited
  const isCompleted = task?.status === 'COMPLETED';

  const { control, handleSubmit, reset, formState: { errors } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'MEDIUM',
      status: 'PENDING',
      start_date: dayjs().format('YYYY-MM-DD'),
      due_date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      assigned_employee_id: 0
    }
  });

  useEffect(() => {
    if (open) {
      dispatch(fetchEmployees({ limit: 500 }));
      if (isEdit && task) {
        reset({
          title: task.title,
          description: task.description || '',
          priority: task.priority,
          status: task.status,
          start_date: dayjs(task.start_date).format('YYYY-MM-DD'),
          due_date: dayjs(task.due_date).format('YYYY-MM-DD'),
          assigned_employee_id: task.assigned_employee_id,
        });
      } else {
        reset({
          title: '',
          description: '',
          priority: 'MEDIUM',
          status: 'PENDING',
          start_date: dayjs().format('YYYY-MM-DD'),
          due_date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
          assigned_employee_id: 0
        });
      }
      dispatch(clearTaskMessages());
    }
  }, [open, isEdit, task, reset, dispatch]);

  useEffect(() => {
    if (successMessage) {
      if (onSuccess) onSuccess();
      onClose();
    }
  }, [successMessage, onClose, onSuccess]);

  const onSubmit = (data: TaskFormValues) => {
    if (isEdit && task) {
      const payload: UpdateTaskPayload = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        start_date: data.start_date,
        due_date: data.due_date,
        assigned_employee_id: data.assigned_employee_id
      };
      dispatch(updateTask({ id: task.id, payload }));
    } else {
      const payload: CreateTaskPayload = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        start_date: data.start_date,
        due_date: data.due_date,
        assigned_employee_id: data.assigned_employee_id
      };
      dispatch(createTask(payload));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Task' : 'Add New Task'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {actionError && (
            <Box sx={{ mb: 2 }}>
              <Typography color="error" variant="body2">{actionError}</Typography>
            </Box>
          )}
          {isCompleted && isEdit && (
            <Box sx={{ mb: 2 }}>
              <Typography color="warning.main" variant="body2">
                This task is marked as COMPLETED. Editing might be restricted by the system.
              </Typography>
            </Box>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Task Title"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    disabled={isCompleted}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    disabled={isCompleted}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Priority"
                    fullWidth
                    error={!!errors.priority}
                    helperText={errors.priority?.message}
                    disabled={isCompleted}
                  >
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Status"
                    fullWidth
                    error={!!errors.status}
                    helperText={errors.status?.message}
                  >
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Start Date"
                    type="date"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    error={!!errors.start_date}
                    helperText={errors.start_date?.message}
                    disabled={isCompleted}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="due_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Due Date"
                    type="date"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    error={!!errors.due_date}
                    helperText={errors.due_date?.message}
                    disabled={isCompleted}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="assigned_employee_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Assign To Employee"
                    fullWidth
                    error={!!errors.assigned_employee_id}
                    helperText={errors.assigned_employee_id?.message}
                    disabled={isCompleted || employeesLoading}
                  >
                    <MenuItem value={0} disabled>
                      {employeesLoading ? 'Loading employees...' : 'Select Employee'}
                    </MenuItem>
                    {employees.map((emp) => (
                      <MenuItem key={emp.id} value={emp.id}>
                        {emp.full_name} ({emp.email})
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit" disabled={actionLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={actionLoading} startIcon={actionLoading && <CircularProgress size={20} />}>
            {isEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskFormDialog;
