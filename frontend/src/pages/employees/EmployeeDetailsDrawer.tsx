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
  ListItemText,
  Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BadgeIcon from '@mui/icons-material/Badge';
import type { Employee } from '../../services/employee.service';

interface EmployeeDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const EmployeeDetailsDrawer: React.FC<EmployeeDetailsDrawerProps> = ({ open, onClose, employee }) => {
  if (!employee) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={600}>Employee Details</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main', fontSize: '2rem' }}>
          {employee.full_name.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h5" fontWeight={700}>{employee.full_name}</Typography>
        <Chip 
          label={employee.role} 
          color={employee.role === 'ADMIN' ? 'secondary' : 'primary'} 
          size="small" 
          sx={{ mt: 1 }} 
        />
      </Box>

      <List sx={{ px: 2 }}>
        <ListItem>
          <Box sx={{ mr: 2, color: 'text.secondary', display: 'flex' }}><BadgeIcon /></Box>
          <ListItemText primary="Employee ID" secondary={employee.id} />
        </ListItem>
        <Divider component="li" />
        <ListItem>
          <Box sx={{ mr: 2, color: 'text.secondary', display: 'flex' }}><EmailIcon /></Box>
          <ListItemText primary="Email Address" secondary={employee.email} />
        </ListItem>
        <Divider component="li" />
        <ListItem>
          <Box sx={{ mr: 2, color: 'text.secondary', display: 'flex' }}><BusinessIcon /></Box>
          <ListItemText primary="Department" secondary={employee.department || 'Not specified'} />
        </ListItem>
        <Divider component="li" />
        <ListItem>
          <Box sx={{ mr: 2, color: 'text.secondary', display: 'flex' }}><WorkIcon /></Box>
          <ListItemText primary="Designation" secondary={employee.designation || 'Not specified'} />
        </ListItem>
        <Divider component="li" />
        <ListItem>
          <Box sx={{ mr: 2, color: 'text.secondary', display: 'flex' }}><CalendarMonthIcon /></Box>
          <ListItemText 
            primary="Joined Date" 
            secondary={employee.created_at ? new Date(employee.created_at).toLocaleDateString() : 'N/A'} 
          />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default EmployeeDetailsDrawer;
