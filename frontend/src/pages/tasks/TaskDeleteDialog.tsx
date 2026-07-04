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
import { deleteTask, clearTaskMessages } from '../../store/features/taskSlice';
import type { Task } from '../../services/task.service';

interface TaskDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onSuccess?: () => void;
}

const TaskDeleteDialog: React.FC<TaskDeleteDialogProps> = ({ open, onClose, task, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { actionLoading, successMessage } = useSelector((state: RootState) => state.task);

  useEffect(() => {
    if (open) {
      dispatch(clearTaskMessages());
    }
  }, [open, dispatch]);

  const handleDelete = async () => {
    if (task) {
      try {
        await dispatch(deleteTask(task.id)).unwrap();
        if (onSuccess) onSuccess();
        onClose();
      } catch (e) {
        // Error handled by redux
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Task</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the task <strong>"{task?.title}"</strong>? 
          This action cannot be undone.
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

export default TaskDeleteDialog;
