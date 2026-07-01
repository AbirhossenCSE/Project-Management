# Nexus.io — Project Management Suite

A full-stack project management application with role-based dashboards for Admins and Members.

## Live Demo
ember-project-suite.vercel.app

🛠️ Tech Stack
Frontend: React, TypeScript, Vite, TanStack Router, Tailwind CSS, shadcn/ui
Backend: Node.js, Express, MongoDB Atlas, JWT Authentication
Deployment: Vercel (Client + Server)

✨ Features
Role-based access control (Admin / Member)
Admin dashboard with analytics and project health
Project creation with member assignment
Task management with Kanban board (drag & drop)
Sprint planning and progress tracking
Real-time data from MongoDB Atlas
JWT authentication (register, login, logout)

🚀 Getting Started
bash# Clone the repo
git clone https://github.com/AbirhossenCSE/Project-Management.git
cd Project-Management

# Install client dependencies
npm install

# Install server dependencies
cd server && npm install
⚙️ Environment Variables
server/.env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ember_project_suite
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
.env (client root)
VITE_API_URL=http://localhost:5000/api/v1
🏃 Running Locally
bash# Terminal 1 — Start server
cd server && npm run dev

# Terminal 2 — Start client
npm run dev
📁 Project Structure
Project-Management/
├── src/                  # React client
│   ├── components/       # UI components
│   ├── routes/           # Page routes (Admin + Member)
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service layer
│   ├── store/            # State management
│   └── types/            # TypeScript interfaces
└── server/               # Express API
    └── src/
        ├── models/       # MongoDB models
        ├── controllers/  # Business logic
        ├── routes/       # API endpoints
        └── middleware/   # JWT auth
👤 Author

AbirhossenCSE — GitHub