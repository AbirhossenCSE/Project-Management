# 🚀 Nexus.io — Project Management Suite

A modern **full-stack Project Management Application** built to help teams efficiently manage projects, tasks, and sprints with secure role-based access control.

Designed with a clean UI, powerful dashboards, Kanban task management, and JWT authentication.

---

## 🌐 Live Demo

🔗 **https://ember-project-suite.vercel.app**

---

# ✨ Features

### 🔐 Authentication & Security
- JWT Authentication
- User Registration & Login
- Secure Protected Routes
- Role-Based Authorization
- Persistent Authentication

### 👨‍💼 Admin Features
- Interactive Admin Dashboard
- Project Analytics
- Project Health Monitoring
- Create & Manage Projects
- Assign Members to Projects
- Manage Users

### 👨‍💻 Member Features
- Personalized Dashboard
- View Assigned Projects
- Task Management
- Sprint Progress Tracking
- Update Task Status

### 📋 Project Management
- Create Projects
- Edit Projects
- Member Assignment
- Project Progress Overview
- Deadline Management

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
- Dark Clean Interface
- Mobile Friendly
- Reusable Components
- Fast Navigation

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
Project-Management/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── routes/
│   ├── services/
│   ├── store/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       └── server.ts
│
├── package.json
└── README.md
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
(Admin / Member)
```

---

# 📸 Application Modules

- 🔐 Authentication
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

Example Endpoints

```text
POST    /auth/register

POST    /auth/login

GET     /projects

POST    /projects

PUT     /projects/:id

DELETE  /projects/:id

GET     /tasks

POST    /tasks

PUT     /tasks/:id

DELETE  /tasks/:id
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