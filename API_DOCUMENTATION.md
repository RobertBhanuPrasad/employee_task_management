# Employee Task Management System - API Documentation

Base URL: `/api/v1`

---

## 1. Authentication Module

### 1.1 User Login
- **Endpoint:** `/auth/login`
- **Method:** `POST`
- **Authentication:** None
- **Description:** Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Validation:**
- `email`: Required, must be a valid email format.
- `password`: Required, string.

**Possible Errors:**
- `400 Bad Request`: Validation errors.
- `401 Unauthorized`: Invalid credentials.

**Example Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1...",
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "role": "ADMIN",
      "full_name": "Admin User"
    }
  }
}
```

---

### 1.2 User Registration
- **Endpoint:** `/auth/register`
- **Method:** `POST`
- **Authentication:** Admin Token Required
- **Description:** Registers a new user (employee or admin).

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "EMPLOYEE",
  "department": "Engineering",
  "designation": "Software Engineer"
}
```

**Validation:**
- `email`: Required, valid email, must be unique.
- `password`: Minimum 6 characters.
- `role`: Must be `ADMIN` or `EMPLOYEE`.

**Possible Errors:**
- `400 Bad Request`: Email already exists, validation failed.
- `403 Forbidden`: Insufficient permissions (not Admin).

**Example Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "id": 2,
    "email": "john.doe@example.com",
    "role": "EMPLOYEE"
  }
}
```

---

## 2. Employees Module

### 2.1 Get All Employees
- **Endpoint:** `/employees`
- **Method:** `GET`
- **Authentication:** Bearer Token (Admin Only)
- **Description:** Retrieves a paginated list of all employees.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or email.

**Possible Errors:**
- `401 Unauthorized`: Token missing or invalid.
- `403 Forbidden`: Not an Admin.

**Example Response:**
```json
{
  "status": "success",
  "data": {
    "employees": [
      {
        "id": 2,
        "full_name": "John Doe",
        "email": "john.doe@example.com",
        "role": "EMPLOYEE",
        "department": "Engineering",
        "designation": "Software Engineer"
      }
    ],
    "pagination": {
      "totalRecords": 1,
      "currentPage": 1,
      "totalPages": 1,
      "limit": 10
    }
  }
}
```

### 2.2 Update Employee
- **Endpoint:** `/employees/:id`
- **Method:** `PUT`
- **Authentication:** Bearer Token (Admin Only)
- **Description:** Updates an employee's details.

**Request Body:**
```json
{
  "full_name": "Johnathan Doe",
  "department": "Senior Engineering"
}
```

**Possible Errors:**
- `404 Not Found`: Employee does not exist.

**Example Response:**
```json
{
  "status": "success",
  "message": "Employee updated successfully",
  "data": {
    "employee": {
      "id": 2,
      "full_name": "Johnathan Doe"
    }
  }
}
```

### 2.3 Delete Employee
- **Endpoint:** `/employees/:id`
- **Method:** `DELETE`
- **Authentication:** Bearer Token (Admin Only)
- **Description:** Deletes an employee from the system.

**Possible Errors:**
- `400 Bad Request`: Cannot delete yourself.
- `404 Not Found`: Employee does not exist.

**Example Response:**
```json
{
  "status": "success",
  "message": "Employee deleted successfully"
}
```

---

## 3. Tasks Module

### 3.1 Get Tasks
- **Endpoint:** `/tasks`
- **Method:** `GET`
- **Authentication:** Bearer Token
- **Description:** Retrieves paginated tasks. Admins see all tasks, employees see only their assigned tasks.

**Query Parameters:**
- `page`, `limit`: Pagination parameters.
- `status`: `PENDING`, `IN_PROGRESS`, `COMPLETED`
- `priority`: `LOW`, `MEDIUM`, `HIGH`
- `employeeId`: Filter by employee (Admin only).

**Example Response:**
```json
{
  "status": "success",
  "data": {
    "tasks": [
      {
        "id": 1,
        "title": "Build API",
        "description": "Create RESTful API documentation",
        "priority": "HIGH",
        "status": "IN_PROGRESS",
        "due_date": "2026-07-05T00:00:00.000Z",
        "assigned_employee_name": "John Doe"
      }
    ],
    "pagination": {
      "totalRecords": 1,
      "currentPage": 1
    }
  }
}
```

### 3.2 Create Task
- **Endpoint:** `/tasks`
- **Method:** `POST`
- **Authentication:** Bearer Token (Admin Only)
- **Description:** Assigns a new task to an employee.

**Request Body:**
```json
{
  "title": "Build API",
  "description": "Create RESTful API documentation",
  "priority": "HIGH",
  "status": "PENDING",
  "start_date": "2026-07-04",
  "due_date": "2026-07-05",
  "assigned_employee_id": 2
}
```

**Validation:**
- `due_date` cannot be before `start_date`.
- `assigned_employee_id` must exist.

**Possible Errors:**
- `400 Bad Request`: Invalid dates or missing fields.
- `404 Not Found`: Assigned employee not found.

**Example Response:**
```json
{
  "status": "success",
  "message": "Task created successfully",
  "data": {
    "task": {
      "id": 1,
      "title": "Build API"
    }
  }
}
```

### 3.3 Update Task
- **Endpoint:** `/tasks/:id`
- **Method:** `PUT`
- **Authentication:** Bearer Token
- **Description:** Updates a task. Employees can only update the `status` of their own tasks. Admins can update all fields.

**Request Body (Employee):**
```json
{
  "status": "COMPLETED"
}
```

**Possible Errors:**
- `403 Forbidden`: Employees attempting to update restricted fields (e.g., `due_date`, `priority`).
- `404 Not Found`: Task not found.

**Example Response:**
```json
{
  "status": "success",
  "message": "Task updated successfully"
}
```

### 3.4 Delete Task
- **Endpoint:** `/tasks/:id`
- **Method:** `DELETE`
- **Authentication:** Bearer Token (Admin Only)

---

## 4. Notifications Module

### 4.1 Get User Notifications
- **Endpoint:** `/notifications`
- **Method:** `GET`
- **Authentication:** Bearer Token
- **Description:** Gets recent notifications for the authenticated user.

**Example Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 10,
      "title": "New Task Assigned",
      "message": "You have been assigned: Build API",
      "is_read": false,
      "created_at": "2026-07-04T12:00:00.000Z"
    }
  ]
}
```

### 4.2 Mark Notification as Read
- **Endpoint:** `/notifications/mark-read/:id`
- **Method:** `PUT`
- **Authentication:** Bearer Token

### 4.3 Mark All as Read
- **Endpoint:** `/notifications/mark-all-read`
- **Method:** `PUT`
- **Authentication:** Bearer Token

---

## 5. Reports Module

### 5.1 JSON Reports
- **GET** `/reports/completed` - Retrieve completed tasks report.
- **GET** `/reports/pending` - Retrieve pending/in-progress tasks report.
- **GET** `/reports/employee-wise` - Retrieve aggregated task counts per employee.

### 5.2 CSV / Excel Export
- **GET** `/reports/completed/export/csv`
- **GET** `/reports/pending/export/excel`
- **Description:** Returns a binary stream download of the requested report format.

---

## 6. Uploads Module

### 6.1 Upload File
- **Endpoint:** `/uploads`
- **Method:** `POST`
- **Authentication:** Bearer Token (Admin Only)
- **Headers:** `Content-Type: multipart/form-data`
- **Description:** Uploads a document (PDF, PNG, JPG). Max size: 5MB.

**FormData Payload:**
- `file`: (Binary File)

**Possible Errors:**
- `400 Bad Request`: Invalid file type or file too large.

**Example Response:**
```json
{
  "status": "success",
  "message": "File uploaded successfully",
  "data": {
    "id": 1,
    "filename": "document.pdf",
    "url": "/uploads/documents/document.pdf"
  }
}
```

### 6.2 Get Uploaded Files
- **Endpoint:** `/uploads`
- **Method:** `GET`
- **Authentication:** Bearer Token

### 6.3 Delete Upload
- **Endpoint:** `/uploads/:id`
- **Method:** `DELETE`
- **Authentication:** Bearer Token (Admin Only)
