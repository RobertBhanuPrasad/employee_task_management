import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import dashboardReducer from './features/dashboardSlice';
import employeeReducer from './features/employeeSlice';
import taskReducer from './features/taskSlice';
import notificationReducer from './features/notificationSlice';
import uploadReducer from './features/uploadSlice';
import reportReducer from './features/reportSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    employee: employeeReducer,
    task: taskReducer,
    notification: notificationReducer,
    upload: uploadReducer,
    report: reportReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
