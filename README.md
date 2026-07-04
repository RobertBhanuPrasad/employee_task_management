# Employee Task Management System

## 📖 Project Overview
The Employee Task Management System is an enterprise-grade web application designed to streamline task delegation, progress tracking, and employee management within an organization. Built with a modern, decoupled architecture, it features a robust role-based access control (RBAC) system distinguishing between Administrators and Employees, ensuring secure and focused workflows. 

Administrators have full visibility and control over all employees and tasks, while Employees can manage their assigned tasks, view upcoming deadlines, and track personal performance metrics. The application boasts a responsive, high-performance interface with dynamic dashboards and data visualization.

---

## ✨ Features

### Admin Features
- **Comprehensive Dashboard:** View aggregate statistics (Total Employees, Total Tasks, Completed, Pending, Overdue) and visualize task statuses via interactive charts.
- **Employee Management:** Perform full CRUD operations on employee records. Manage roles (Admin/Employee), departments, and designations.
- **Global Task Management:** Create, assign, update, and delete tasks for any employee. Set priorities, statuses, and strict deadlines.
- **Data Export:** Export detailed task reports.

### Employee Features
- **Personalized Dashboard:** Track personal metrics including My Tasks, Completed Tasks, Pending/In-Progress Tasks, and Overdue tasks.
- **Task Execution:** View detailed information on assigned tasks, update task statuses (e.g., from Pending to In Progress to Completed), and monitor upcoming deadlines.
- **Notifications:** Receive real-time updates regarding new task assignments and approaching due dates.

### Core System Features
- **Role-Based Authentication (RBAC):** Secure JWT-based authentication ensuring isolated views and restricted actions based on user roles.
- **Performance Optimized:** Uses React StrictMode-compliant data fetching with Redux Toolkit's unwrap pattern to prevent infinite render loops and duplicate API calls.
- **Robust Validation:** Frontend form validation using Zod and React Hook Form; backend schema validation using express-validator.
- **File Upload Module:** Secure file management for attachments, supporting local disk storage with strict type and size validation.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 (with TypeScript)
- **Build Tool:** Vite
- **State Management:** Redux Toolkit (RTK)
- **Routing:** React Router DOM v6
- **UI Component Library:** Material-UI (MUI) v5
- **Data Grid:** MUI X-DataGrid (Server-side pagination & sorting)
- **Forms & Validation:** React Hook Form + Zod
- **Data Fetching:** Axios (with centralized interceptors)
- **Charts:** MUI X-Charts

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (with TypeScript)
- **Database:** MySQL 2 (via `mysql2/promise`)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Validation:** express-validator
- **File Uploads:** Multer
- **Architecture:** Controller-Service-Repository Pattern

---

## 📁 Folder Structure

```text
employee_task_management/
├── backend/                  # Node.js Express Server
│   ├── src/
│   │   ├── config/           # Database and environment configurations
│   │   ├── controllers/      # Request handlers and response formatting
│   │   ├── dtos/             # Data Transfer Objects & Validation Schemas
│   │   ├── middlewares/      # JWT auth, RBAC, and error handlers
│   │   ├── repositories/     # Direct MySQL database interactions
│   │   ├── routes/           # Express route definitions
│   │   ├── services/         # Core business logic
│   │   └── index.ts          # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                 # React Vite SPA
    ├── src/
    │   ├── components/       # Reusable UI components (Layouts, Cards)
    │   ├── pages/            # Page components (Dashboard, Tasks, Employees)
    │   ├── services/         # API integrations (axios instances, endpoints)
    │   ├── store/            # Redux store, slices, and async thunks
    │   ├── utils/            # Helpers (Token management, formatters)
    │   ├── App.tsx           # Main application routing
    │   └── main.tsx          # React DOM render entry
    ├── package.json
    └── vite.config.ts
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- MySQL Server (v8.0+)
- npm or yarn

### 1. Database Setup
1. Log into your local MySQL instance.
2. Create a new database:
   ```sql
   CREATE DATABASE task_management_db;
   ```
3. The backend uses raw SQL queries and repository patterns. Ensure your MySQL server is running on the default port (`3306`). (Migration scripts or schema setup files should be executed if provided in `/backend/database/`).

### 2. Environment Variables

**Backend (`backend/.env`)**
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=task_management_db
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h
```

**Frontend (`frontend/.env`)**
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Running the Backend
```bash
cd backend
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

### 4. Running the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

---

## 📚 API Documentation (Endpoints Overview)

**Auth:**
- `POST /api/v1/auth/login` - Authenticate user & get JWT token
- `POST /api/v1/auth/register` - Register a new employee/admin

**Tasks:**
- `GET /api/v1/tasks` - Get paginated tasks (filtered by role)
- `GET /api/v1/tasks/:id` - Get specific task details
- `POST /api/v1/tasks` - Create a new task (Admin only)
- `PUT /api/v1/tasks/:id` - Update task (Status updatable by assignee)
- `DELETE /api/v1/tasks/:id` - Delete task (Admin only)

**Employees:**
- `GET /api/v1/employees` - Get paginated employees
- `POST /api/v1/employees` - Create employee
- `PUT /api/v1/employees/:id` - Update employee details
- `DELETE /api/v1/employees/:id` - Delete employee

**Dashboard:**
- `GET /api/v1/dashboard/admin` - Admin aggregate statistics
- `GET /api/v1/dashboard/employee` - Employee specific statistics

---

## 🔐 Authentication Flow
1. User submits credentials via `/login`.
2. Backend validates against hashed password in MySQL.
3. Backend issues a signed JWT containing `id`, `email`, and `role`.
4. Frontend stores the JWT securely (LocalStorage/SessionStorage).
5. All subsequent Axios requests attach the JWT as a Bearer token via interceptors.
6. Backend `authMiddleware` verifies the token; `roleMiddleware` verifies permissions for protected routes.
7. Upon a 401 response (token expiry), the frontend interceptor auto-logs the user out.

---

## 📸 Application Screenshots
*(Add screenshots of your Dashboard, Tasks List, and Forms here by placing images in an `assets` folder and linking them like `![Dashboard](./assets/dashboard.png)`)*

---

## ✅ Assignment Requirements Checklist
- [x] **RBAC:** Differentiated Admin and Employee views.
- [x] **Dashboard:** Statistics and recent items for both roles (Pending tasks added for Employees).
- [x] **Task Management:** Full CRUD, assignment, status tracking, date validation.
- [x] **Employee Management:** Full CRUD operations for organizational members.
- [x] **Tech Stack:** Node, Express, MySQL, React.
- [x] **Best Practices:** Layered architecture, normalized database, robust state management, UI consistency.

---

## 🔮 Future Improvements
- **WebSockets / Socket.io:** Implement real-time push notifications instead of relying on REST polling.
- **Audit Logging:** Add an `activity_logs` table to track granular "who changed what and when" for enterprise compliance.
- **Drag and Drop Kanban Board:** Visualize tasks moving between Pending, In Progress, and Completed states.
- **Email Integration:** Send automated email alerts for upcoming or overdue tasks via NodeMailer or SendGrid.

---

## 📄 License
This project is licensed under the MIT License.
