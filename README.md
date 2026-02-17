# 🚀 Freelance Hub: Full-Stack Client Manager

A professional, full-stack dashboard designed for freelancers to manage clients, track project progress, and visualize their workload. Built with a modern **React** frontend and a high-performance **FastAPI** backend.



## ✨ Key Features
* **Dual-Entity Management:** Create and manage Clients and their associated Projects.
* **Relational Logic:** Uses SQLAlchemy to link multiple projects to a single client (One-to-Many).
* **Dynamic Theme Toggle:** Switch between Light and Dark mode with persistent styling.
* **Real-time Workflow:** Toggle project statuses between "In Progress" and "Completed" with instant UI feedback.
* **Modern UI:** Responsive design using Lucide-React icons and Glassmorphism effects.

## 🛠️ Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Axios, Lucide-React |
| **Backend** | Python, FastAPI, Uvicorn |
| **Database** | SQLite, SQLAlchemy |
| **Schema/Validation** | Pydantic V2 |

## 🚀 Getting Started

### 1. Backend Setup
1. Navigate to the root directory.
2. Install dependencies:
    pip install -r requirements.txt
3. Start the API server:
    uvicorn main:app --reload

### 2. Frontend Setup
1. Navigate to the frontend directory.
2. Install dependencies:
    npm install
3. Start the development server:
    npm start

## 📸 Project Architecture
The application follows a standard RESTful API architecture where the React frontend communicates with the FastAPI backend via asynchronous HTTP requests.

## 📝 Future Roadmap
[ ] Implement a Search/Filter bar for large client lists.
[ ] Add Budget/Income tracking per project.
[ ] User Authentication (JWT) for private access.