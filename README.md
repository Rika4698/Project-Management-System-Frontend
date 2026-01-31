# Role-Based Admin & Project Management System (Frontend)

A comprehensive full-stack application featuring invitation-based user onboarding, Role-Based Access Control (RBAC), and project management with soft delete.

## Live link: https://project-management-system-frontend-five.vercel.app/

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose
- **Frontend**: React, TypeScript, Redux Toolkit, Tailwind CSS
- **Validation**: Zod (Request validation)
- **Authentication**: JWT, bcryptjs
- **Engineering**: Clean Architecture (Controllers, Services, Validations), Standardized Error Handling

## Core Features

- **Invitation System**: Admins generate unique invite tokens. Users can only register if they have a valid, unexpired token.
- **RBAC**: 
  - **ADMIN**: Full control over users and projects.
  - **MANAGER/STAFF**: Can create and view projects. Only ADMIN can EDIT or DELETE projects.
- **Project Management**: Soft delete implementation ensures data is never permanently removed from the database.
- **User Management**: Admins can:
  - Invite new users
  - Change user roles (`ADMIN`, `MANAGER`, `STAFF`)
  - Activate/deactivate users
  - View paginated list of all users
- **Security**: JWT-based authentication, password hashing, and role-based middleware.

### **🛠️ Environment Setup**

To get the project running locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Rika4698/Project-Management-System-Frontend.git
    cd Project-Management-System-Frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the necessary variables. Follow the `.env.example` file as a template. Locally `.env` api: `VITE_API_URL=http://localhost:5000/api`


4.  **Start the server:**
    ```bash
    
    npm run dev
    ```
    The API will be available at `http://localhost:5173`.



---


## Backend Architecture

The backend follows a professional, scalable folder structure:
- `src/controllers`: Request/Response handling using the `catchAsync` wrapper.
- `src/services`: Business logic and database operations (Fat Services).
- `src/models`: Mongoose models and schemas.
- `src/validations`: Zod schemas for strict request validation.
- `src/interfaces`: Centralized TypeScript interfaces (IUser, IProject, etc.).
- `src/middleware`: Custom middleware for Authentication, RBAC, and centralized Error handling.
- `src/utils`: Helper utilities like `AppError` and `catchAsync`.

---

## API Endpoints

### Auth
- `POST /api/auth/login` - User login
- `POST /api/auth/invite` - Generate user invite (ADMIN only)
- `POST /api/auth/register-via-invite` - Complete registration
- `POST /api/auth/refresh-token` - Refresh access token

### Users
- `GET /api/users?page=1&limit=10&search=john` - Get all users (ADMIN only, paginated, searchable)
- `PATCH /api/users/:id/role` - Update user role (ADMIN only)
- `PATCH /api/users/:id/status` - Update user status (ADMIN only)

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects?search=myproject` - Get projects (Searchable)
- `PATCH /api/projects/:id` - Edit project (ADMIN only)
- `DELETE /api/projects/:id` - Soft delete (ADMIN only)
---



## 👤 Author & Contact

### Name: Sharmin Akter Reka
### Role: Frontend Developer
### Portfolio: https://my-portfolio-df10f.web.app/

*Thanks for exploring the Role-Based Admin & Project Management System!*

