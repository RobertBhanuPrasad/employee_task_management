# Architecture Documentation

## 1. System Overview
The Employee Task Management System (HRMS) is designed utilizing a modern, decoupled **Client-Server Architecture**. It strictly separates the presentation layer (Frontend) from the business logic and data persistence layer (Backend). This separation of concerns ensures horizontal scalability, independent deployment cycles, and clear boundaries of responsibility.

---

## 2. Frontend Architecture (React + Vite)
The frontend is built as a **Single Page Application (SPA)** using React 18, bundled by Vite for high-performance development and optimized production builds.

### Design Decisions:
- **UI Component Library (Material UI):** Chosen for its enterprise-ready, accessible, and customizable components (like DataGrid). It accelerates development while maintaining a cohesive design system.
- **Form Management (React Hook Form + Zod):** Chosen over controlled components to minimize re-renders. Zod provides strict schema validation, ensuring data integrity before network requests are dispatched.
- **Routing (React Router DOM v6):** Utilizes nested routing to manage layouts (e.g., `AuthLayout` vs `DashboardLayout`), allowing for persistent UI shells while swapping out inner page content without full page reloads.

---

## 3. Backend Architecture (Node.js + Express)
The backend employs a strictly typed **Layered Architecture (N-Tier)** utilizing the **Controller-Service-Repository Pattern**. 

### The Layers:
1. **Routes Layer (`routes/`):** Entry point for HTTP requests. Maps URIs to specific Controller methods and applies middlewares (Auth/RBAC/Validation).
2. **Controller Layer (`controllers/`):** Handles HTTP concerns. It parses incoming `req` objects, delegates business logic to the Service layer, and formats the HTTP `res` (status codes, JSON payloads).
3. **Service Layer (`services/`):** The core business logic engine. It enforces business rules (e.g., checking if a task due date is valid) and orchestrates data fetching. It is entirely ignorant of HTTP contexts.
4. **Repository Layer (`repositories/`):** The data access layer. It encapsulates all raw MySQL queries, ensuring the rest of the application is abstracted away from database-specific SQL syntax.

### Design Decisions:
- **Repository Pattern:** Chosen to decouple the business logic from the database implementation. If the system were to migrate from raw `mysql2` queries to an ORM (like Prisma or TypeORM) in the future, only the Repository layer would need to change.
- **Data Transfer Objects (DTOs):** Define strict interfaces for incoming data, preventing injection attacks and ensuring type safety across the application boundaries.

---

## 4. State Management: The Redux Flow
The frontend utilizes **Redux Toolkit (RTK)** to manage global application state, handling asynchronous data fetching and complex state transitions.

### The Flow:
1. **Trigger:** A React component dispatches an asynchronous action (e.g., `dispatch(fetchTasks())`).
2. **Thunk Middleware:** RTK's `createAsyncThunk` intercepts the action. It immediately dispatches a `pending` lifecycle action, allowing the UI to show loading spinners.
3. **API Call:** The thunk invokes an encapsulated API service method, awaiting the HTTP response.
4. **Resolution:** 
   - On success, a `fulfilled` action is dispatched with the response payload.
   - On failure, a `rejected` action is dispatched with the error message.
5. **Reducer:** The slice's `extraReducers` catches these lifecycle actions and synchronously mutates the state (via Immer).
6. **Selector:** React components utilize `useSelector` to subscribe to the state slice, triggering targeted re-renders upon state changes.

### Design Decisions:
- **The `.unwrap()` Pattern:** For mutations (Create/Update/Delete), components utilize `await dispatch(action()).unwrap()`. This was a critical architectural pivot to prevent infinite render loops caused by legacy `useEffect` side-effects. It ensures the component retains localized control of its post-mutation behavior (like closing a dialog or refreshing a list).

---

## 5. Security: JWT Authentication Flow
The application implements a stateless JSON Web Token (JWT) architecture for secure authentication and Role-Based Access Control (RBAC).

### The Flow:
1. **Authentication:** The client submits credentials to `/api/v1/auth/login`.
2. **Verification:** The backend validates the user and password (via bcrypt).
3. **Token Generation:** The backend signs a JWT using a secret key, embedding the user's `id`, `email`, and `role` in the payload, with a set expiration (e.g., 24h).
4. **Client Storage:** The frontend receives the JWT and stores it securely in LocalStorage.
5. **Authorization:** For subsequent requests, the frontend interceptor attaches the JWT as a `Bearer` token in the Authorization header.
6. **Backend Middleware:** The `authMiddleware` intercepts incoming requests, verifies the JWT signature, extracts the user payload, and attaches it to `req.user`.

---

## 6. Networking: Axios Interceptor Flow
The frontend centralizes all HTTP requests through a configured Axios instance to ensure consistency and DRY (Don't Repeat Yourself) principles.

### The Flow:
1. **Request Interceptor:** Before any request leaves the browser, the interceptor fires. It retrieves the JWT from LocalStorage and attaches it to the headers.
2. **Response Interceptor:** Upon receiving a response, this interceptor checks for global errors. If a `401 Unauthorized` status is detected (indicating token expiration or tampering), it automatically purges the local token and redirects the user to the login screen, safeguarding the application state.

---

## 7. Data Persistence: Database Flow
The system utilizes a relational database (MySQL 2) optimized for transaction integrity.

### The Flow:
1. **Connection Pooling:** The backend initializes a `mysql2/promise` connection pool on startup. This allows multiple concurrent requests to efficiently borrow and return database connections without the overhead of establishing new TCP handshakes.
2. **Query Execution:** Repositories execute parameterized SQL queries (`?`) to fundamentally prevent SQL injection attacks.
3. **Relational Integrity:** The database engine enforces constraints (Foreign Keys, ENUMs). Triggers and cascading rules (`ON DELETE CASCADE`) automatically maintain data hygiene without requiring application-level cleanup logic.

---

## 8. Complete API Request Flow (End-to-End)
Here is the lifecycle of a typical request (e.g., "Admin creating a task"):

1. **User Action:** Admin clicks "Submit" on the TaskFormDialog.
2. **Frontend Validation:** React Hook Form validates the inputs via Zod.
3. **State Dispatch:** The component dispatches `createTask(payload).unwrap()`.
4. **Axios Interceptor:** The JWT is attached to the POST request headers.
5. **Express Router:** The request hits `POST /api/v1/tasks`.
6. **Express Middleware:**
   - `authMiddleware` validates the JWT.
   - `roleMiddleware` confirms the user is an ADMIN.
   - `express-validator` validates the JSON payload structure.
7. **Controller:** `taskController.createTask` receives the validated `req.body` and passes it to `taskService`.
8. **Service:** `taskService` executes business logic (e.g., validating dates) and passes the DTO to `taskRepository`.
9. **Repository:** Executes `INSERT INTO tasks...` via the MySQL pool.
10. **Response Chain:** The DB returns the `insertId` -> Service formats it -> Controller sends a `201 Created` JSON response.
11. **Redux Resolution:** The `createTask` thunk fulfills, updating the global state.
12. **UI Update:** The `.unwrap()` promise resolves in the component, which triggers a localized refresh function, closes the dialog, and displays a Success Snackbar.

---

## 9. Folder Structure (Monorepo)

```text
employee_task_management/
├── backend/                  
│   ├── src/
│   │   ├── config/           # Centralized environment & DB configs
│   │   ├── controllers/      # HTTP Req/Res handlers (The "C" in MVC)
│   │   ├── dtos/             # Data Transfer Objects / Request validation
│   │   ├── middlewares/      # Request interceptors (Auth, Logging)
│   │   ├── repositories/     # Database queries (Data Access Layer)
│   │   ├── routes/           # Express endpoint definitions
│   │   ├── services/         # Core Business Logic Layer
│   │   └── index.ts          # Server bootstrap
│   └── uploads/              # Local storage for file attachments
│
└── frontend/                 
    ├── src/
    │   ├── components/       # Dumb/Presentational UI components
    │   ├── layout/           # App shells (Sidebar, Topbar)
    │   ├── pages/            # Smart/Container components (Views)
    │   ├── services/         # Axios API clients
    │   ├── store/            # Redux setup (Slices, Thunks, Store)
    │   ├── utils/            # Helper functions (Auth, Formatting)
    │   ├── App.tsx           # Theme and Router provider
    │   └── main.tsx          # DOM entry point
    └── vite.config.ts        # Bundler configuration
```
