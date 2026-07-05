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
  CircularProgress,
  Tooltip
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { createEmployee, updateEmployee, clearEmployeeMessages } from '../../store/features/employeeSlice';
import type { Employee, CreateEmployeePayload, UpdateEmployeePayload } from '../../services/employee.service';

const baseSchema = {
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Must be a valid email address'),
  role: z.enum(['ADMIN', 'EMPLOYEE'], { required_error: 'Role is required' }),
  department: z.string().optional(),
  designation: z.string().optional()
};

const createSchema = z.object({
  ...baseSchema,
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirm_password: z.string().min(1, 'Confirm password is required')
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"]
});

const updateSchema = z.object({
  ...baseSchema,
});

type EmployeeFormValues = z.infer<typeof createSchema> | z.infer<typeof updateSchema>;

interface EmployeeFormDialogProps {
  open: boolean;
  onClose: () => void;
  employee?: Employee | null;
  onSuccess?: () => void;
}

const EmployeeFormDialog: React.FC<EmployeeFormDialogProps> = ({ open, onClose, employee, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { actionLoading, actionError, successMessage } = useSelector((state: RootState) => state.employee);
  const isEdit = !!employee;

  const { control, handleSubmit, reset, formState: { errors } } = useForm<EmployeeFormValues>({
    resolver: zodResolver(isEdit ? updateSchema : createSchema),
    defaultValues: {
      full_name: '',
      email: '',
      role: 'EMPLOYEE',
      department: '',
      designation: '',
      password: '',
      confirm_password: ''
    }
  });

  useEffect(() => {
    if (open) {
      if (isEdit && employee) {
        reset({
          full_name: employee.full_name,
          email: employee.email,
          role: employee.role,
          department: employee.department || '',
          designation: employee.designation || '',
        });
      } else {
        reset({
          full_name: '',
          email: '',
          role: 'EMPLOYEE',
          department: '',
          designation: '',
          password: '',
          confirm_password: ''
        });
      }
      dispatch(clearEmployeeMessages());
    }
  }, [open, isEdit, employee, reset, dispatch]);

  const onSubmit = async (data: EmployeeFormValues) => {
    try {
      if (isEdit && employee) {
        const payload: UpdateEmployeePayload = {
          full_name: data.full_name,
          role: data.role as 'ADMIN' | 'EMPLOYEE',
          department: data.department,
          designation: data.designation
        };
        await dispatch(updateEmployee({ id: employee.id, payload })).unwrap();
      } else {
        const createData = data as z.infer<typeof createSchema>;
        const payload: CreateEmployeePayload = {
          full_name: createData.full_name,
          email: createData.email,
          password: createData.password,
          confirm_password: createData.confirm_password,
          role: createData.role as 'ADMIN' | 'EMPLOYEE',
          department: createData.department,
          designation: createData.designation
        };
        await dispatch(createEmployee(payload)).unwrap();
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      // Error handled by redux
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {actionError && (
            <Box sx={{ mb: 2 }}>
              <Typography color="error" variant="body2">{actionError}</Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5 }}>
              <Controller
                name="full_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Full Name"
                    fullWidth
                    error={!!errors.full_name}
                    helperText={errors.full_name?.message}
                    sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  isEdit ? (
                    <Tooltip title="You can't edit or change the email" arrow placement="top">
                      <span style={{ display: 'flex', flex: 1 }}>
                        <TextField
                          {...field}
                          label="Email"
                          fullWidth
                          type="email"
                          disabled={true}
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          sx={{ width: '100%', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </span>
                    </Tooltip>
                  ) : (
                    <TextField
                      {...field}
                      label="Email"
                      fullWidth
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  )
                )}
              />
            </Box>

            {!isEdit && (
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5 }}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Password"
                      fullWidth
                      type="password"
                      error={!!errors.password}
                      helperText={(errors as any).password?.message}
                      sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  )}
                />
                <Controller
                  name="confirm_password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Confirm Password"
                      fullWidth
                      type="password"
                      error={!!errors.confirm_password}
                      helperText={(errors as any).confirm_password?.message}
                      sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  )}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5 }}>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Role"
                    fullWidth
                    error={!!errors.role}
                    helperText={errors.role?.message}
                    sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  >
                    <MenuItem value="EMPLOYEE">Employee</MenuItem>
                  </TextField>
                )}
              />
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Department"
                    fullWidth
                    error={!!errors.department}
                    helperText={errors.department?.message}
                    sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )}
              />
              <Controller
                name="designation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Designation"
                    fullWidth
                    error={!!errors.designation}
                    helperText={errors.designation?.message}
                    sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit" disabled={actionLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={actionLoading} startIcon={actionLoading && <CircularProgress size={20} />}>
            {isEdit ? 'Save Changes' : 'Add Employee'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EmployeeFormDialog;
