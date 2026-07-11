# 🚀 Nexus.io — Project Management Suite

A modern **full-stack Project Management Application** built to help teams efficiently manage projects, tasks, and sprints with secure role-based access control.

Designed with a clean UI, powerful dashboards, Kanban task management, and JWT authentication.

---

## 🌐 Live Demo

🔗 **https://ember-project-suite.vercel.app**

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | test@test.com | 12345678 |
| Super Admin | superadmin@gmail.com | Superadmin@123 |

> Note: Register a new account to access as Member.

---

# ✨ Features

### 🔐 Authentication & Security
- JWT Authentication
- User Registration & Login
- Secure Protected Routes
- Role-Based Authorization
- Persistent Authentication
- Password show/hide toggle on login/register
- Password strength indicator on register

### 👑 Super Admin & Role Management
- Super Admin Panel (hidden `/superadmin` route)
- User role promotion/demotion (promote member to admin)
- User deletion by super admin
- Automatic Super Admin account seeding on server start

### 👨‍💼 Admin Features
- Interactive Admin Dashboard
- Project Analytics
- Project Health Monitoring
- Create & Manage Projects
- Assign Members to Projects during creation
- Manage Users

### 👨‍💻 Member Features
- Personalized Dashboard
- View Assigned Projects
- Task Management
- Sprint Progress Tracking
- Update Task Status
- Member-only task filtering (members see only assigned tasks)

### 📋 Project Management
- Create Projects with member assignment during creation
- Edit Projects
- Project Progress Overview
- Deadline Management
- Search functionality (projects + tasks)

### ✅ Task Management
- Kanban Board
- Drag & Drop Tasks
- Task Status Updates
- Task Assignment
- Priority Management

### 📊 Sprint Management
- Sprint Planning
- Progress Tracking
- Completion Statistics

### 🎨 UI/UX
- Modern Responsive Design
- Dark/Light/System theme toggle
- Mobile Friendly
- Reusable Components
- Fast Navigation

---

## 🔒 Super Admin Panel
Access at `/superadmin` — only available to `superadmin@gmail.com`
- View and manage all users
- Change user roles (admin/member)
- Delete users
- Protected: secure email-based JWT access control

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- TanStack Router
- Tailwind CSS
- shadcn/ui
- Axios

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt

## Deployment

- Vercel (Frontend)
- Vercel Serverless Functions (Backend)

---

# 📂 Project Structure

```text
src/
├── components/
│   ├── layout/     (AppShell, AuthLayout)
│   ├── shared/     (Avatar, Kanban, Charts, etc.)
│   └── ui/         (shadcn components)
├── hooks/
├── routes/
│   ├── admin.*     (Admin pages)
│   └── app.*       (Member pages)
├── services/
├── store/
└── types/

server/src/
├── config/         (db, seedSuperAdmin)
├── controllers/
├── middleware/     (JWT auth)
├── models/         (User, Project, Task, Sprint)
└── routes/
```

---

# ⚙️ Environment Variables

## Server (`server/.env`)

```env
PORT=5000

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ember_project_suite

JWT_SECRET=your_jwt_secret

CLIENT_ORIGIN=http://localhost:5173

NODE_ENV=development
```

---

## Client (`.env`)

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/AbirhossenCSE/Project-Management.git

cd Project-Management
```

---

## Install Dependencies

### Client

```bash
npm install
```

### Server

```bash
cd server

npm install
```

---

# ▶️ Run the Application

## Start Backend

```bash
cd server

npm run dev
```

---

## Start Frontend

```bash
npm run dev
```

---

# 🔐 Authentication Flow

```
User
   │
   ▼
Login / Register
   │
   ▼
JWT Generated
   │
   ▼
Stored in Browser
   │
   ▼
Protected Routes
   │
   ▼
Role Verification
(Super Admin / Admin / Member)
```

---

# 📸 Application Modules

- 🔐 Authentication
- 🔒 Super Admin Panel
- 📊 Admin Dashboard
- 👨‍💻 Member Dashboard
- 📁 Project Management
- ✅ Task Management
- 📌 Kanban Board
- 🚀 Sprint Planning
- 📈 Analytics
- 👥 Team Management

---

# 💻 API

Base URL

```text
http://localhost:5000/api/v1
```

Endpoints

```text
POST    /auth/register
POST    /auth/login
GET     /auth/me
PATCH   /auth/me
PATCH   /auth/change-password

GET     /projects
POST    /projects
PUT     /projects/:id
DELETE  /projects/:id

GET     /tasks
POST    /tasks
PUT     /tasks/:id
DELETE  /tasks/:id

GET     /users
PATCH   /admin-panel/users/:id/role
DELETE  /admin-panel/users/:id
```

---

# 🎯 Future Improvements

- Notifications
- File Uploads
- Team Chat
- Calendar Integration
- Activity Timeline
- Email Invitations
- Comments System
- Project Templates
- Time Tracking
- Performance Reports

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push the branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

### Abir Hossen

- GitHub: **https://github.com/AbirhossenCSE**

---

## ⭐ If you found this project helpful, don't forget to give it a Star!