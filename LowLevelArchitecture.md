# Low-Level Architecture (LLA)

## 1. Frontend Component & State Architecture

### 1.1 Store & State Management (Redux Toolkit)
The frontend utilizes a heavily modularized Redux store (`/src/store/index.ts`).
- **`authSlice`**: Manages `isAuthenticated`, `user` object, and `token`. Handles `loginUser` and `logoutUser` async thunks.
- **`dashboardSlice`**: Manages metrics (total tasks, employee count, completion rates).
- **`employeeSlice`**: Manages employee CRUD state (`items`, `loading`, `error`, `pagination`).
- **`taskSlice`**: Manages task list, filters (status, priority), sorting, and task mutations.
- **`notificationSlice`**: Manages `unreadCount` and notification arrays. Uses polling/focus events.
- **`reportSlice` & `uploadSlice`**: Manages file metadata, blob downloads, and upload progress.

### 1.2 Layout & Routing (`/src/routes` & `/src/layout`)
- **`AppRoutes`**: Controls access via `<ProtectedRoute>` (requires JWT) and `<PublicRoute>` (bypasses auth).
- **`DashboardLayout`**: Wraps protected pages. Integrates `<Sidebar>` (navigation) and `<Topbar>` (Profile menu, Notification bell, Search).
- **`AuthLayout`**: Minimal wrapper for `/login` and `/register`.

### 1.3 Form Validation Pipeline
Forms utilize `react-hook-form` bound with `@hookform/resolvers/zod`.
- E.g., `TaskFormDialog.tsx`: Defines `z.object({ title, priority, start_date, due_date })`. Validation prevents submission of invalid dates (due date < start date) purely on the client side before hitting the API.

---

## 2. Backend Service Architecture

### 2.1 Route Configuration (`/src/routes`)
API endpoints are dynamically mounted in `index.ts` under `/api/v1/`:
- **`/auth`**: `POST /login`, `POST /register`, `POST /logout` (Public/Semi-public).
- **`/users`**: Secured by `authenticate` and `authorizeRole('ADMIN')`.
- **`/tasks`**: User-context aware. Employees see own tasks; Admins see all.
- **`/notifications`**: Fetch and mark-as-read endpoints.
- **`/uploads`**: Multipart form data handling.

### 2.2 Middleware Pipeline (`/src/middlewares`)
1. **`authMiddleware.ts`**: Extracts `Bearer <token>`, verifies using `jsonwebtoken`, decodes user payload, and attaches to `req.user`. Throws 401 on failure.
2. **`roleMiddleware.ts`**: Higher-order function `authorizeRole('ADMIN')` checks `req.user.role`. Throws 403 on failure.
3. **`validationMiddleware.ts`**: Intercepts `express-validator` chains. If `validationResult(req)` has errors, returns 400 Bad Request immediately.
4. **`uploadMiddleware.ts`**: Configures `multer` for local disk storage (`/uploads`), filters by MIME type (PDF, JPG, PNG), limits to 5MB.

### 2.3 Layered Business Logic
- **Controllers (`/src/controllers`)**: E.g., `TaskController`. Destructures `req.body` and `req.user.id`. Passes data to `TaskService`. Formats response using `sendResponse` helper.
- **Services (`/src/services`)**: E.g., `TaskService.createTask`. Validates business rules (e.g., "Cannot edit COMPLETED task"). Coordinates between `TaskRepository` and `NotificationRepository` (triggers assignment notifications).
- **Repositories (`/src/repositories`)**: E.g., `TaskRepository`. Executes `pool.query(SELECT * FROM tasks WHERE ...)`. Translates RowDataPackets to JSON objects.

---

## 3. Database Low-Level Design (MySQL)

### 3.1 Schema & Tables
- **`users`**:
  - `id` (INT, PK, Auto Increment)
  - `full_name`, `email` (UNIQUE, Indexed)
  - `password` (Bcrypt hashed string)
  - `role` (ENUM: 'ADMIN', 'EMPLOYEE')
- **`tasks`**:
  - `id` (INT, PK)
  - `priority` (ENUM: 'LOW', 'MEDIUM', 'HIGH')
  - `status` (ENUM: 'PENDING', 'IN_PROGRESS', 'COMPLETED')
  - `start_date`, `due_date`
  - `assigned_employee_id` (FK -> users.id)
  - `created_by` (FK -> users.id)
  - **Constraint**: `CHECK (due_date >= start_date)`
- **`notifications`**:
  - `id` (INT, PK)
  - `user_id` (FK), `task_id` (FK)
  - `type` (ENUM: 'TASK_ASSIGNED', 'TASK_COMPLETED', 'TASK_DUE')
  - `is_read` (TINYINT/Boolean)
- **`uploads`**:
  - `id` (INT, PK)
  - `task_id` (FK -> tasks.id)
  - `file_path` (VARCHAR, physical path on disk)

### 3.2 Indexing Strategy
- `idx_task_employee (assigned_employee_id)` for fast filtering by user.
- `idx_task_status (status)` for dashboard metrics grouping.
- `idx_notification_user (user_id)` for quick notification polling.

---

## 4. Deep-Dive Workflows

### 4.1 Authentication Security Flow
1. Client submits email/password to `POST /api/v1/auth/login`.
2. `AuthValidator` checks email format and password presence.
3. `AuthController` calls `AuthService.login`.
4. `AuthRepository.findByEmail` retrieves user hash.
5. `bcrypt.compare()` verifies password.
6. `jwt.sign()` generates token with `{ id, email, role }` payload, expiring in 24h.
7. Token returned to client -> stored in localStorage -> attached to subsequent Axios headers.

### 4.2 Cascading Actions (Task Assignment)
1. Admin submits new task via UI.
2. Request hits `POST /api/v1/tasks`.
3. `TaskService.createTask` inserts task via `TaskRepository.create`.
4. `TaskService` identifies `assigned_employee_id`.
5. `TaskService` directly calls `NotificationService.createNotification(assigned_employee_id, 'New task assigned')`.
6. Database constraints ensure if user is deleted, `ON DELETE CASCADE` triggers removal of tasks and notifications automatically.







above is low level architecture diagram related information so please scan eveything in detailed of every corner without missing anything and i want to share the pdf to the recruiter about the assignment so think as like 10 years experienced person and generate the low level architecture diagram and give me