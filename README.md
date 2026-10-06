# SmartSplit 💰

SmartSplit is a microservices-based expense splitting platform
that helps users create groups, track expenses, split bills,
and manage settlements.

## 🚀 Features

- User authentication
- JWT authentication
- Google authentication
- User profiles
- Group creation and management
- Add/remove group members
- Expense splitting
- Settlement tracking
- AI-powered expense insights
- Notifications
- REST APIs
- Microservices architecture
- Docker support

## 🏗️ Architecture

Frontend
    ↓
API Gateway
    ↓
┌──────────────┬──────────────┬──────────────┐
│ Auth Service │ User Service │ Group Service│
└──────────────┴──────────────┴──────────────┘
          ↓
   Expense Service
          ↓
 Settlement Service
          ↓
      AI Service

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL

### DevOps
- Docker
- Docker Compose
- Nginx
- GitHub

## 📁 Project Structure

SmartSplit/
├── frontend/
├── backend/
│   └── services/
├── docker-compose.yml
├── .gitignore
└── README.md