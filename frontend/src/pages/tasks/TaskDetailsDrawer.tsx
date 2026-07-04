import React from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  Divider, 
  Chip,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import InfoIcon from '@mui/icons-material/Info';
import type { Task } from '../../services/task.service';

interface TaskDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'HIGH': return 'error';
    case 'MEDIUM': return 'warning';
    case 'LOW': return 'success';
    default: return 'default';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED': return 'success';
    case 'IN_PROGRESS': return 'info';
    case 'PENDING': return 'warning';
    default: return 'default';
  }
};

const TaskDetailsDrawer: React.FC<TaskDetailsDrawerProps> = ({ open, onClose, task }) => {
  if (!task) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={600}>Task Details</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>{task.title}</Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Chip label={task.status} color={getStatusColor(task.status)} size="small" />
          <Chip label={task.priority} color={getPriorityColor(task.priority)} size="small" variant="outlined" />
        </Box>
      </Box>

      <List sx={{ px: 2 }}>
        <ListItem>
          <Box sx={{ mr: 2, color: 'text.secondary', display: 'flex' }}><InfoIcon /></Box>
          <ListItemText 
            primary="Description" 
            secondary={task.description || 'No description provided.'} 
            secondaryTypographyProps={{ sx: { whiteSpace: 'pre-wrap' } }}
          />
        </ListItem>
        <Divider component="li" />
        <ListItem>
          <Box sx={{ mr: 2, color: 'text.secondary', display: 'flex' }}><AssignmentIcon /></Box>
          <ListItemText 
            primary="Assigned To" 
            secondary={task.assigned_employee_name || `Employee ID: ${task.assigned_employee_id}`} 
          />
        </ListItem>
        <Divider component="li" />
        <ListItem>
          <Box sx={{ mr: 2, color: 'text.secondary', display: 'flex' }}><CalendarTodayIcon /></Box>
          <ListItemText 
            primary="Start Date" 
            secondary={task.start_date ? new Date(task.start_date).toLocaleDateString() : 'N/A'} 
          />
        </ListItem>
        <Divider component="li" />
        <ListItem>
          <Box sx={{ mr: 2, color: 'text.secondary', display: 'flex' }}><EventBusyIcon /></Box>
          <ListItemText 
            primary="Due Date" 
            secondary={task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'} 
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default TaskDetailsDrawer;
