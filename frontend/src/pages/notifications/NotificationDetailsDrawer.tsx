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
import InfoIcon from '@mui/icons-material/Info';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LinkIcon from '@mui/icons-material/Link';
import type { Notification } from '../../../services/notification.service';

interface NotificationDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  notification: Notification | null;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'TASK_ASSIGNED': return 'primary';
    case 'TASK_COMPLETED': return 'success';
    case 'TASK_DUE': return 'warning';
    case 'SYSTEM': return 'default';
    default: return 'default';
  }
};

const NotificationDetailsDrawer: React.FC<NotificationDetailsDrawerProps> = ({ open, onClose, notification }) => {
  if (!notification) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={600}>Notification Details</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>{notification.title}</Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Chip label={notification.type.replace('_', ' ')} color={getTypeColor(notification.type)} size="small" />
          <Chip label={notification.is_read ? 'Read' : 'Unread'} color={notification.is_read ? 'default' : 'error'} size="small" variant={notification.is_read ? 'outlined' : 'filled'} />
        </Box>
      </Box>

      <List sx={{ px: 2 }}>
        <ListItem>
          <Box sx={{ mr: 2, color: 'text.secondary', display: 'flex' }}><InfoIcon /></Box>
          <ListItemText 
            primary="Message" 
            secondary={notification.message || 'No additional information.'} 
            secondaryTypographyProps={{ sx: { whiteSpace: 'pre-wrap' } }}
          />
        </ListItem>
        <Divider component="li" />
        <ListItem>
          <Box sx={{ mr: 2, color: 'text.secondary', display: 'flex' }}><CalendarTodayIcon /></Box>
          <ListItemText 
            primary="Date Received" 
            secondary={new Date(notification.created_at).toLocaleString()} 
          />
        </ListItem>
        {notification.related_task_id && (
          <>
            <Divider component="li" />
            <ListItem>
              <Box sx={{ mr: 2, color: 'text.secondary', display: 'flex' }}><LinkIcon /></Box>
              <ListItemText 
                primary="Related Task ID" 
                secondary={`#${notification.related_task_id}`} 
              />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default NotificationDetailsDrawer;
