# Technical Interview Preparation Guide: Employee Task Management System

This guide is designed to simulate a technical interview for the Employee Task Management System. It contains the core topics an interviewer will ask, the exact locations in your codebase where these implementations exist (so you can review them), the "Why, What, and How", and potential follow-up questions.

---

## 📑 Topics for Preparation
1. **System Architecture & Design Patterns (Controller-Service-Repository)**
2. **Database Normalization, Indexes & Integrity (MySQL)**
3. **Authentication, RBAC & Middleware Flow (JWT)**
4. **State Management & Frontend Architecture (Redux Toolkit & `.unwrap()`)**
5. **Axios Networking & Global Error Handling (Interceptors)**
6. **Form Validation & Data Integrity (Zod & express-validator)**

---

## 1. System Architecture & Design Patterns

### 📍 Where to find it in the repository:
* **Controller:** `backend/src/controllers/taskController.ts` (Lines 7-59)
* **Service:** `backend/src/services/taskService.ts` (Lines 7-148)
* **Repository:** `backend/src/repositories/taskRepository.ts` (Lines 5-172)

### ❓ What it is & How it's implemented:
You implemented a **N-Tier (Layered) Architecture**.
* **Controllers** handle HTTP-specific logic (Request/Response, Status Codes).
* **Services** contain the strict business logic (e.g., checking if dates are valid). It is agnostic to HTTP.
* **Repositories** handle direct data persistence (`mysql2` raw queries) and abstract the database from the app.

### 🤔 Why you did it this way:
"I used the Controller-Service-Repository pattern to ensure a strict Separation of Concerns. If we ever need to swap out Express for another framework like Fastify, the Service and Repository layers remain untouched. If we want to switch from raw MySQL to an ORM like Prisma, only the Repository layer changes. It makes the codebase modular, testable, and highly scalable."

### 🎯 Follow-up Questions you might be asked:
* *Q: What would happen if you put business logic directly in your Controller?*
  * **Answer:** It would lead to tightly coupled, duplicated code that is very hard to unit test without mocking the entire HTTP request/response object.
* *Q: How do you handle database connections in the repository?*
  * **Answer:** We use a MySQL Connection Pool (`mysql2/promise`) configured in `backend/src/config/`. It allows concurrent requests to share active TCP connections rather than opening/closing a connection per query, which reduces overhead.

---

## 2. Database Normalization & Integrity

### 📍 Where to find it in the repository:
* **Database Schema:** `schema.sql` or `employee_task_management_complete.sql` (Check constraints like `ON DELETE CASCADE`)
* **Documentation reference:** `DATABASE_DOCUMENTATION.md` (Table ER diagrams)

### ❓ What it is & How it's implemented:
You designed a **3rd Normal Form (3NF)** relational database using MySQL. 
* Entities are separated into `users`, `tasks`, `notifications`, and `uploads`.
* You utilized `Foreign Keys` with specific constraints (`ON DELETE CASCADE` for uploads/notifications linked to tasks, and `ON DELETE SET NULL` for tasks linked to users).

### 🤔 Why you did it this way:
"I normalized the database to 3NF to eliminate data redundancy and ensure single-source-of-truth. I relied on database-level constraints instead of application-level logic for data cleanup. For example, using `ON DELETE CASCADE` on notifications means the backend doesn't have to manually execute a second delete query when a task is removed; the database engine handles it atomically."

### 🎯 Follow-up Questions you might be asked:
* *Q: Why use `SET NULL` for user deletions instead of `CASCADE`?*
  * **Answer:** If an employee leaves the company and their user record is deleted, we don't want to lose the historical company data (the tasks they worked on). Setting the foreign key to NULL preserves the task audit trail.
* *Q: How did you optimize query performance?*
  * **Answer:** I placed explicit indexes on frequently queried foreign keys (like `assigned_employee_id`) and commonly filtered columns (like `status` and `due_date`) to prevent full table scans.

---

## 3. Authentication, RBAC & Middleware Flow

### 📍 Where to find it in the repository:
* **Middleware implementation:** `backend/src/middlewares/authMiddleware.ts` 
* **Route usage:** `backend/src/routes/taskRoutes.ts` (Line 3: `import { authenticate } from '../middlewares/authMiddleware'`)

### ❓ What it is & How it's implemented:
You used **Stateless JSON Web Tokens (JWT)** for authentication and Role-Based Access Control (RBAC). 
* When a user logs in, the backend signs a JWT containing their `id` and `role`.
* Express middleware intercepts protected routes, extracts the `Bearer` token from the headers, verifies the signature, and attaches the payload to `req.user`.

### 🤔 Why you did it this way:
"I chose JWT over stateful session cookies because the architecture is decoupled. JWTs are stateless, meaning the backend doesn't need to query the database or a Redis store on every single request just to verify the user is logged in. It scales perfectly horizontally."

### 🎯 Follow-up Questions you might be asked:
* *Q: How do you prevent users from accessing Admin routes?*
  * **Answer:** I chain middlewares. First, the `authenticate` middleware verifies the token. Next, a `authorizeRoles('ADMIN')` middleware checks if `req.user.role` equals 'ADMIN'. If not, it short-circuits the request and returns a `403 Forbidden`.
* *Q: Where is the JWT stored on the frontend, and what are the security implications?*
  * **Answer:** It is stored in LocalStorage. While vulnerable to XSS, we mitigate this by relying on React (which automatically escapes injected strings) and avoiding `dangerouslySetInnerHTML`. 

---

## 4. State Management & Frontend Architecture

### 📍 Where to find it in the repository:
* **Thunk Setup:** `frontend/src/store/features/taskSlice.ts`
* **Component Usage:** Look at how `.unwrap()` is used in your Task Form components.

### ❓ What it is & How it's implemented:
You managed global state using **Redux Toolkit (RTK)** and `createAsyncThunk`. 
Instead of triggering side-effects with `useEffect` (which causes nasty bugs), you implemented the `.unwrap()` promise pattern.

### 🤔 Why you did it this way:
"Initially, managing async state in React is tricky because components can unmount while requests are pending. I used Redux Toolkit to centralize data fetching. I specifically utilized `.unwrap()` when dispatching mutations (like creating a task). It allows the component to await the Redux action synchronously, meaning I can close modals or show success snackbars exactly when the API succeeds, avoiding infinite render loops and messy `useEffect` dependencies."

### 🎯 Follow-up Questions you might be asked:
* *Q: Why Redux Toolkit instead of plain React Context?*
  * **Answer:** Context is great for static data (like themes), but for frequent async data updates, Context causes unnecessary re-renders across the whole provider tree. Redux allows targeted component subscriptions.
* *Q: Explain the lifecycle of `createAsyncThunk`.*
  * **Answer:** It automatically dispatches a `pending` action when called, and then either a `fulfilled` action (if the promise resolves) or a `rejected` action (if it fails), allowing my reducers to update loading states cleanly.

---

## 5. Axios Networking & Global Error Handling

### 📍 Where to find it in the repository:
* **Interceptor Setup:** `frontend/src/services/api.ts` (Lines 11 & 19)

### ❓ What it is & How it's implemented:
You created a centralized Axios instance utilizing **Request and Response Interceptors**.
* The **Request Interceptor** automatically grabs the JWT from LocalStorage and appends it to the `Authorization` header.
* The **Response Interceptor** listens for global HTTP errors (like 401 Unauthorized).

### 🤔 Why you did it this way:
"To enforce DRY (Don't Repeat Yourself) principles. Instead of manually attaching the auth header in 50 different API calls, the interceptor does it globally. Furthermore, if a user's token expires, the response interceptor catches the 401 error globally, purges local storage, and kicks the user to the login page immediately, maintaining a secure app state."

### 🎯 Follow-up Questions you might be asked:
* *Q: How did you avoid race conditions in the interceptor if multiple requests hit a 401 at the same time?*
  * **Answer:** Since we do not use silent refresh tokens, a 401 acts as a hard logout. Purging the state immediately ensures subsequent requests gracefully fail or redirect.

---

## 6. Form Validation & Data Integrity

### 📍 Where to find it in the repository:
* **Frontend:** Any Form Component using `useForm` (React Hook Form) combined with Zod schemas.
* **Backend:** Validators using `express-validator` (e.g., `backend/src/validators/taskValidator.ts`)

### ❓ What it is & How it's implemented:
You implemented a **Double-Validation Strategy**. 
* **React Hook Form + Zod** provides strict, performant client-side validation.
* **express-validator** provides a safety net on the server.

### 🤔 Why you did it this way:
"Client-side validation (Zod) is for UX—it gives the user immediate feedback without waiting for a slow network roundtrip. However, client-side validation can be bypassed by malicious actors using Postman. Therefore, I implemented `express-validator` on the backend to guarantee data integrity before it ever reaches my Service layer or Database."

### 🎯 Follow-up Questions you might be asked:
* *Q: Why React Hook Form instead of controlled inputs (useState)?*
  * **Answer:** Controlled inputs cause the entire form component to re-render on every single keystroke. React Hook Form registers inputs as uncontrolled components, drastically improving performance on larger forms.
