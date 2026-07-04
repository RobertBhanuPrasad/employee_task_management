import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import TaskIcon from '@mui/icons-material/Task';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export const drawerWidthExpanded = 260;
export const drawerWidthCollapsed = 80;

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  desktopOpen: boolean;
  handleDesktopDrawerToggle: () => void;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Employees', icon: <PeopleIcon />, path: '/employees' },
  { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  { text: 'Uploads', icon: <CloudUploadIcon />, path: '/uploads' },
];

const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  handleDrawerToggle,
  desktopOpen,
  handleDesktopDrawerToggle,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const drawerWidth = desktopOpen ? drawerWidthExpanded : drawerWidthCollapsed;

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      handleDrawerToggle();
    }
  };

  const drawerContent = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: desktopOpen ? 'flex-end' : 'center', p: 1, minHeight: 64 }}>
        {!isMobile && (
          <IconButton onClick={handleDesktopDrawerToggle}>
            {desktopOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
      </Box>
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname.startsWith(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 1 }}>
              <Tooltip title={!desktopOpen && !isMobile ? item.text : ''} placement="right">
                <ListItemButton
                  selected={isSelected}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: desktopOpen ? 'initial' : 'center',
                    px: 2.5,
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.contrastText,
                      },
                    },
                    '&:hover': {
                      backgroundColor: isSelected ? theme.palette.primary.dark : theme.palette.action.hover,
                    },
                    transition: 'all 0.3s ease',
                  }}
                  aria-label={item.text}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: desktopOpen ? 2 : 'auto',
                      justifyContent: 'center',
                      color: isSelected ? theme.palette.primary.contrastText : theme.palette.text.secondary,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      opacity: desktopOpen ? 1 : 0, 
                      display: desktopOpen ? 'block' : 'none',
                      whiteSpace: 'nowrap'
                    }} 
                    primaryTypographyProps={{ fontWeight: isSelected ? 600 : 400 }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 }, transition: 'width 0.3s ease' }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile.
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidthExpanded },
        }}
      >
        {drawerContent}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth, 
            transition: 'width 0.3s ease',
            overflowX: 'hidden' 
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
