# System Architecture

## 1. Overall System Architecture
```mermaid
graph TD
    Client[Browser / Client] -->|HTTP/REST| Server[Express Backend]
    
    subgraph Frontend [Frontend Application - React + Vite]
        React[React Components]
        Redux[Redux Toolkit]
        Axios[Axios Service Layer]
        Router[React Router DOM]
        React --> Router
        React --> Redux
        Redux --> Axios
    end
    
    subgraph Backend [Backend Application - Node.js + Express]
        Express[Express App]
        Middleware[Middlewares: Auth, Role, Validator, Error]
        Routes[API Routes]
        Controllers[Controllers]
        Services[Business Logic Services]
        Repositories[Data Access Repositories]
        
        Express --> Middleware
        Middleware --> Routes
        Routes --> Controllers
        Controllers --> Services
        Services --> Repositories
    end
    
    subgraph Database [Database Layer]
        MySQL[(MySQL 8.0)]
    end
    
    Axios -->|API Requests| Express
    Repositories -->|SQL Queries| MySQL
```

## 2. Frontend Architecture
```mermaid
graph TD
    App[App.tsx] --> Provider[Redux Provider]
    App --> ThemeProvider[MUI ThemeProvider]
    App --> AppRoutes[React Router]
    
    AppRoutes --> AuthLayout[Auth Layout]
    AppRoutes --> DashboardLayout[Dashboard Layout]
    
    AuthLayout --> Login[Login Page]
    AuthLayout --> Register[Register Page]
    
    DashboardLayout --> Topbar[Topbar Component]
    DashboardLayout --> Sidebar[Sidebar Component]
    DashboardLayout --> Dashboard[Dashboard Page]
    DashboardLayout --> Employees[Employees Page]
    DashboardLayout --> Tasks[Tasks Page]
    DashboardLayout --> Notifications[Notifications Page]
    DashboardLayout --> Reports[Reports Page]
    DashboardLayout --> Uploads[Uploads Page]
    
    Dashboard --> Redux[Redux Slices]
    Redux --> Services[Axios API Services]
```

## 3. Backend Layer Diagram
```mermaid
graph TD
    subgraph Request Lifecycle
        Req[Incoming Request] --> Auth[JWT Auth Middleware]
        Auth --> Role[Role Middleware]
        Role --> Validator[Express Validator]
        Validator --> Controller[Controller Method]
        
        Controller --> Service[Service Layer]
        Service --> Repository[Repository Layer]
        Repository --> DB[(MySQL)]
        
        DB --> Repository
        Repository --> Service
        Service --> Controller
        Controller --> Res[HTTP Response]
    end
```

## 4. Folder Architecture Tree
```text
/
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── app.ts                  # Express setup
│   │   ├── server.ts               # Server entry point
│   │   ├── config/                 # Environment configs
│   │   ├── controllers/            # Route controllers
│   │   ├── database/               # MySQL connection pool
│   │   ├── dtos/                   # Data Transfer Objects
│   │   ├── middlewares/            # Auth, Validation, Error handlers
│   │   ├── repositories/           # Database queries
│   │   ├── routes/                 # Express router setup
│   │   ├── services/               # Business logic
│   │   ├── utils/                  # Helpers (JWT, Pagination, Logger)
│   │   └── validators/             # Express-validator schemas
│   └── uploads/                    # Local file storage
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.ts
│   ├── src/
│   │   ├── App.tsx                 # Main React component
│   │   ├── main.tsx                # React DOM render
│   │   ├── components/             # Reusable UI components
│   │   ├── constants/              # App constants
│   │   ├── layout/                 # Page layouts (Sidebar, Topbar)
│   │   ├── pages/                  # Route components
│   │   ├── routes/                 # Router configuration
│   │   ├── services/               # Axios API clients
│   │   ├── store/                  # Redux store & slices
│   │   ├── styles/                 # MUI Theme configuration
│   │   └── utils/                  # Helper functions
└── schema.sql                      # Database schema
```
