# High-Level Architecture (HLA)

## 1. Executive Summary
The Employee Task Management System follows a classic **3-Tier Architecture**, decoupling the presentation layer (Frontend), business logic layer (Backend API), and data persistence layer (Database). This separation of concerns ensures scalability, maintainability, and security across enterprise HRMS operations.

## 2. Technology Stack
- **Frontend Layer:** React 19, Vite, Redux Toolkit (State Management), Material UI (Component Library), React Router DOM (Routing), Zod (Client-side Validation).
- **Backend Layer:** Node.js, Express.js (REST API framework), express-validator (Server-side Validation), JSON Web Tokens (Authentication).
- **Database Layer:** MySQL 8.0, accessed via `mysql2/promise` using raw SQL queries for optimized performance.

## 3. High-Level Architecture Diagram

```mermaid
graph TD
    %% Define external actors
    Client[Web Browser / User]

    %% Define sub-systems
    subgraph Frontend [Presentation Tier - SPA]
        ReactUI[React.js UI Components]
        ReduxStore[Redux Global State]
        AxiosClient[Axios HTTP Client]
        ReactUI --> ReduxStore
        ReactUI --> AxiosClient
        ReduxStore --> AxiosClient
    end

    subgraph Backend [Application Tier - REST API]
        ExpressRouter[Express Router / API Gateway]
        Middlewares[Security & Validation Middlewares]
        Controllers[Controllers]
        Services[Business Logic Layer]
        Repositories[Data Access Layer]
        
        ExpressRouter --> Middlewares
        Middlewares --> Controllers
        Controllers --> Services
        Services --> Repositories
    end

    subgraph Database [Data Tier - Relational DB]
        MySQL[(MySQL Database)]
        FileSystem[Local File Storage]
    end

    %% Connections
    Client -- "HTTPS / UI Interaction" --> ReactUI
    AxiosClient -- "REST API Calls (JSON)" --> ExpressRouter
    Repositories -- "SQL Queries" --> MySQL
    Repositories -- "File I/O" --> FileSystem
```

## 4. Subsystem Overviews

### A. Presentation Tier (Frontend)
A Single Page Application (SPA) built with Vite and React. It utilizes Redux Toolkit for centralized state management, keeping local component state to a minimum. The UI is constructed strictly with Material UI (MUI) components, ensuring a cohesive, enterprise-grade design system.

### B. Application Tier (Backend)
An Express.js RESTful API structured around the **Controller-Service-Repository** design pattern:
- **Routes:** Maps HTTP verbs and endpoints to specific controllers.
- **Controllers:** Handle HTTP request/response lifecycles and extract payloads.
- **Services:** Contain pure business logic and transactional workflows.
- **Repositories:** Abstract all raw database interactions (SQL).

### C. Data Tier (Database)
A relational MySQL database enforcing strict data integrity through Foreign Keys, constraints, and optimized indexing. Local server storage is utilized for file uploads, with metadata tracked relationally within MySQL.
