const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'frontend/src');
const frontend = path.join(__dirname, 'frontend');

const files = {
  '.env': `VITE_API_BASE_URL=http://localhost:5000/api\n`,
  '.prettierrc': `{\n  "semi": true,\n  "singleQuote": true,\n  "trailingComma": "es5",\n  "printWidth": 100\n}\n`,
  'vite.config.ts': `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nimport path from 'path';\n\nexport default defineConfig({\n  plugins: [react()],\n  resolve: {\n    alias: {\n      '@': path.resolve(__dirname, './src'),\n    },\n  },\n});\n`,
  'tsconfig.app.json': `{\n  "compilerOptions": {\n    "target": "ES2020",\n    "useDefineForClassFields": true,\n    "lib": ["ES2020", "DOM", "DOM.Iterable"],\n    "module": "ESNext",\n    "skipLibCheck": true,\n\n    /* Bundler mode */\n    "moduleResolution": "bundler",\n    "allowImportingTsExtensions": true,\n    "resolveJsonModule": true,\n    "isolatedModules": true,\n    "noEmit": true,\n    "jsx": "react-jsx",\n\n    /* Linting */\n    "strict": true,\n    "noUnusedLocals": true,\n    "noUnusedParameters": true,\n    "noFallthroughCasesInSwitch": true,\n    "baseUrl": ".",\n    "paths": {\n      "@/*": ["src/*"]\n    }\n  },\n  "include": ["src"]\n}\n`,
  'src/constants/apiEndpoints.ts': `export const API_ENDPOINTS = {\n  AUTH: {\n    LOGIN: '/auth/login',\n  },\n  EMPLOYEES: '/employees',\n  TASKS: '/tasks',\n  DASHBOARD: '/dashboard',\n  NOTIFICATIONS: '/notifications',\n  UPLOADS: '/uploads',\n  REPORTS: '/reports',\n};\n`,
  'src/utils/localStorage.ts': `export const setItem = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value));\nexport const getItem = (key: string) => {\n  const item = localStorage.getItem(key);\n  return item ? JSON.parse(item) : null;\n};\nexport const removeItem = (key: string) => localStorage.removeItem(key);\nexport const clear = () => localStorage.clear();\n`,
  'src/utils/tokenHelper.ts': `import { setItem, getItem, removeItem } from './localStorage';\n\nexport const setToken = (token: string) => setItem('token', token);\nexport const getToken = (): string | null => getItem('token');\nexport const removeToken = () => removeItem('token');\n`,
  'src/utils/dateHelper.ts': `import dayjs from 'dayjs';\n\nexport const formatDate = (date: string | Date, format = 'YYYY-MM-DD') => dayjs(date).format(format);\n`,
  'src/utils/downloadHelper.ts': `export const downloadFile = (url: string, filename: string) => {\n  const link = document.createElement('a');\n  link.href = url;\n  link.download = filename;\n  document.body.appendChild(link);\n  link.click();\n  document.body.removeChild(link);\n};\n`,
  'src/services/api.ts': `import axios from 'axios';\nimport { getToken } from '../utils/tokenHelper';\n\nconst api = axios.create({\n  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',\n  headers: {\n    'Content-Type': 'application/json',\n  },\n});\n\napi.interceptors.request.use((config) => {\n  const token = getToken();\n  if (token && config.headers) {\n    config.headers.Authorization = \`Bearer \${token}\`;\n  }\n  return config;\n});\n\napi.interceptors.response.use(\n  (response) => response,\n  (error) => {\n    if (error.response?.status === 401) {\n      // handle unauthorized\n    }\n    return Promise.reject(error);\n  }\n);\n\nexport default api;\n`,
  'src/store/index.ts': `import { configureStore } from '@reduxjs/toolkit';\nimport authReducer from './features/authSlice';\nimport dashboardReducer from './features/dashboardSlice';\nimport employeeReducer from './features/employeeSlice';\nimport taskReducer from './features/taskSlice';\nimport notificationReducer from './features/notificationSlice';\nimport uploadReducer from './features/uploadSlice';\nimport reportReducer from './features/reportSlice';\n\nexport const store = configureStore({\n  reducer: {\n    auth: authReducer,\n    dashboard: dashboardReducer,\n    employee: employeeReducer,\n    task: taskReducer,\n    notification: notificationReducer,\n    upload: uploadReducer,\n    report: reportReducer,\n  },\n});\n\nexport type RootState = ReturnType<typeof store.getState>;\nexport type AppDispatch = typeof store.dispatch;\n`,
};

const slices = ['auth', 'dashboard', 'employee', 'task', 'notification', 'upload', 'report'];
slices.forEach((slice) => {
  files[\`src/store/features/\${slice}Slice.ts\`] = \`import { createSlice } from '@reduxjs/toolkit';\n\nconst initialState = {};\n\nconst \${slice}Slice = createSlice({\n  name: '\${slice}',\n  initialState,\n  reducers: {}\n});\n\nexport default \${slice}Slice.reducer;\n\`;
});

const pages = ['auth/Login', 'dashboard/Dashboard', 'employees/Employees', 'tasks/Tasks', 'notifications/Notifications', 'uploads/Uploads', 'reports/Reports', 'NotFound'];
pages.forEach((page) => {
  const name = page.split('/').pop() || page;
  const lowerName = page.split('/')[0];
  const folder = page.includes('/') ? \`src/pages/\${lowerName}\` : 'src/pages';
  if (!fs.existsSync(path.join(frontend, folder))) fs.mkdirSync(path.join(frontend, folder), { recursive: true });
  files[\`\${folder}/\${name}.tsx\`] = \`import React from 'react';\n\nconst \${name} = () => {\n  return <div>\${name} Page (Placeholder)</div>;\n};\n\nexport default \${name};\n\`;
});

const layouts = ['AuthLayout', 'DashboardLayout', 'Sidebar', 'Topbar', 'Footer', 'Breadcrumb', 'ResponsiveContainer'];
layouts.forEach((layout) => {
  files[\`src/layout/\${layout}.tsx\`] = \`import React from 'react';\n${layout === 'DashboardLayout' ? "import { Outlet } from 'react-router-dom';\n" : ''}${layout === 'AuthLayout' ? "import { Outlet } from 'react-router-dom';\n" : ''}\nconst \${layout} = ({ children }: { children?: React.ReactNode }) => {\n  return <div>\n    \${layout}\n    ${layout === 'DashboardLayout' || layout === 'AuthLayout' ? '<Outlet />' : '{children}'}\n  </div>;\n};\n\nexport default \${layout};\n\`;
});

files['src/routes/index.tsx'] = \`import React from 'react';\nimport { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';\nimport AuthLayout from '../layout/AuthLayout';\nimport DashboardLayout from '../layout/DashboardLayout';\nimport Login from '../pages/auth/Login';\nimport Dashboard from '../pages/dashboard/Dashboard';\nimport Employees from '../pages/employees/Employees';\nimport Tasks from '../pages/tasks/Tasks';\nimport Notifications from '../pages/notifications/Notifications';\nimport Uploads from '../pages/uploads/Uploads';\nimport Reports from '../pages/reports/Reports';\nimport NotFound from '../pages/NotFound';\n\nconst AppRoutes = () => {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route path="/" element={<Navigate to="/dashboard" replace />} />\n        \n        <Route element={<AuthLayout />}>\n          <Route path="/login" element={<Login />} />\n        </Route>\n\n        <Route element={<DashboardLayout />}>\n          <Route path="/dashboard" element={<Dashboard />} />\n          <Route path="/employees" element={<Employees />} />\n          <Route path="/tasks" element={<Tasks />} />\n          <Route path="/notifications" element={<Notifications />} />\n          <Route path="/uploads" element={<Uploads />} />\n          <Route path="/reports" element={<Reports />} />\n        </Route>\n\n        <Route path="*" element={<NotFound />} />\n      </Routes>\n    </BrowserRouter>\n  );\n};\n\nexport default AppRoutes;\n\`;

files['src/App.tsx'] = \`import React from 'react';\nimport AppRoutes from './routes';\nimport { Provider } from 'react-redux';\nimport { store } from './store';\nimport { CssBaseline, ThemeProvider, createTheme } from '@mui/material';\n\nconst theme = createTheme({});\n\nfunction App() {\n  return (\n    <Provider store={store}>\n      <ThemeProvider theme={theme}>\n        <CssBaseline />\n        <AppRoutes />\n      </ThemeProvider>\n    </Provider>\n  );\n}\n\nexport default App;\n\`;

files['src/main.tsx'] = \`import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n\`;

for (const [file, content] of Object.entries(files)) {
  const fullPath = path.join(frontend, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf-8');
}
console.log('Done scaffolding!');
