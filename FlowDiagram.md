# Application Flow Diagrams

## 1. Authentication Flow
```mermaid
sequenceDiagram
    participant User
    participant React as Frontend UI
    participant Redux
    participant API as Backend (Auth)
    participant DB as MySQL
    
    User->>React: Enters Credentials
    React->>Redux: Dispatch loginUser(credentials)
    Redux->>API: POST /api/v1/auth/login
    API->>DB: SELECT * FROM users WHERE email
    DB-->>API: User Record
    API->>API: Verify Password & Generate JWT
    API-->>Redux: { token, user }
    Redux->>React: Update Auth State
    React->>React: Save Token to LocalStorage
    React->>User: Redirect to /dashboard
```

## 2. Dashboard Loading Flow
```mermaid
sequenceDiagram
    participant React as Dashboard
    participant Redux
    participant API as Backend (Dashboard)
    
    React->>Redux: Dispatch fetchDashboardStats()
    Redux->>API: GET /api/v1/dashboard/stats
    API-->>Redux: Return Metrics (Tasks, Users)
    Redux-->>React: Update State
    React->>React: Render Charts & Metrics
```

## 3. Employee Management Flow
```mermaid
graph TD
    A[Admin navigates to /employees] --> B[Dispatch fetchEmployees()]
    B --> C[GET /api/v1/users]
    C --> D[Render DataGrid]
    
    D --> E{Action}
    E -->|Create| F[Open EmployeeFormDialog]
    F --> G[Submit Form]
    G --> H[POST /api/v1/users]
    
    E -->|Edit| I[Open EmployeeFormDialog]
    I --> J[Submit Form]
    J --> K[PUT /api/v1/users/:id]
    
    E -->|Delete| L[Open DeleteDialog]
    L --> M[Confirm Delete]
    M --> N[DELETE /api/v1/users/:id]
    
    H --> B
    K --> B
    N --> B
```

## 4. Task Management Flow
```mermaid
graph TD
    A[User navigates to /tasks] --> B[Dispatch fetchTasks()]
    B --> C[GET /api/v1/tasks]
    C --> D[Render Task List]
    
    D --> E{Action}
    E -->|Create Task| F[POST /api/v1/tasks]
    F --> G[Task Created in DB]
    G --> H[Trigger Notification via TaskService]
    
    E -->|Update Status| I[PUT /api/v1/tasks/:id]
    I --> J[Validate Rules (e.g. Completed tasks immutable)]
    J --> K[Task Updated in DB]
    K --> L[Trigger Status Notification]
```

## 5. Notification Flow
```mermaid
sequenceDiagram
    participant TaskService
    participant NotifRepo as NotificationRepository
    participant DB as MySQL
    participant Client as Employee Client
    
    TaskService->>NotifRepo: createNotification(userId, message)
    NotifRepo->>DB: INSERT INTO notifications
    
    Client->>Client: Periodic Polling / Focus Event
    Client->>Backend: GET /api/v1/notifications/unread-count
    Backend-->>Client: unreadCount = 1
    
    Client->>Backend: GET /api/v1/notifications
    Backend-->>Client: Notification List
    
    Client->>Backend: PUT /api/v1/notifications/:id/read
    Backend->>DB: UPDATE notifications SET is_read = 1
```

## 6. Uploads Flow
```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant Backend
    participant FileSystem
    participant DB
    
    Admin->>Frontend: Selects File & Submits
    Frontend->>Backend: POST /api/v1/uploads/:taskId (multipart/form-data)
    Backend->>FileSystem: Save to /uploads directory
    FileSystem-->>Backend: File Path
    Backend->>DB: INSERT INTO uploads (metadata)
    DB-->>Backend: Upload Record
    Backend-->>Frontend: Success Response
```

## 7. Logout Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    
    User->>Frontend: Clicks Logout
    Frontend->>Backend: POST /api/v1/auth/logout
    Backend-->>Frontend: Success (Clear Cookies/Session)
    Frontend->>Frontend: Clear LocalStorage Token
    Frontend->>Frontend: Reset Redux State
    Frontend->>User: Redirect to /login
```
