import React, { useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button,
  CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { deleteEmployee, clearEmployeeMessages } from '../../store/features/employeeSlice';
import type { Employee } from '../../services/employee.service';

interface EmployeeDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSuccess?: () => void;
}

const EmployeeDeleteDialog: React.FC<EmployeeDeleteDialogProps> = ({ open, onClose, employee, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { actionLoading, successMessage } = useSelector((state: RootState) => state.employee);

  useEffect(() => {
    if (open) {
      dispatch(clearEmployeeMessages());
    }
  }, [open, dispatch]);

  const handleDelete = async () => {
    if (employee) {
      try {
        await dispatch(deleteEmployee(employee.id)).unwrap();
        if (onSuccess) onSuccess();
        onClose();
      } catch (e) {
        // Error handled by redux
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Employee</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the employee <strong>{employee?.full_name}</strong>? 
          This action cannot be undone and will permanently remove their access to the system.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={actionLoading}>
          Cancel
        </Button>
        <Button 
          onClick={handleDelete} 
          color="error" 
          variant="contained" 
          disabled={actionLoading}
          startIcon={actionLoading && <CircularProgress size={20} color="inherit" />}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDeleteDialog;
