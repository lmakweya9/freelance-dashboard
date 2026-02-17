# 🚀 Freelance Hub: Full-Stack Client Manager

A professional, full-stack dashboard designed for freelancers to manage clients, track project progress, and visualize their workload. Built with a modern **React** frontend and a high-performance **FastAPI** backend.
Link to live program: https://freelance-dashboard-ruddy.vercel.app/

## ✨ Key Features
* **Dual-Entity Management:** Create and manage Clients and their associated Projects.
* **Relational Logic:** Uses SQLAlchemy to link multiple projects to a single client (One-to-Many).
* **Dynamic Theme Toggle:** Switch between Light and Dark mode with persistent styling.
* **Real-time Workflow:** Toggle project statuses between "In Progress" and "Completed" with instant UI feedback.
* **Modern UI:** Responsive design using Lucide-React icons and Glassmorphism effects.


## 🐛 Bug Fixes & Technical Challenges
One of the most valuable parts of this project was navigating environment-specific errors during development:

### 1. The Bcrypt Version Clash
**Issue:** `AttributeError: module 'bcrypt' has no attribute '__about__'`
**Solution:** Discovered a version mismatch between `passlib` and `bcrypt 4.1.0`. Fixed by downgrading to `bcrypt==4.0.1` to maintain compatibility with the hashing utility.

### 2. JWT vs PyJWT Module Confusion
**Issue:** `ModuleNotFoundError: No module named 'jwt'` even after installation.
**Solution:** Corrected the package installation to `PyJWT`. In Python, the import is `jwt`, but the pip package is `PyJWT`.

### 3. Database Schema Evolution
**Issue:** `sqlite3.OperationalError: no such column` after adding the Budget field.
**Solution:** Implemented a manual migration strategy by clearing the `test.db` and allowing SQLAlchemy's `Base.metadata.create_all` to redefine the schema with the new columns.

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
[x] Implement a Search/Filter bar for large client lists.
[x] Add Budget/Income tracking per project.
[x] User Authentication (JWT) for private access.
[ ] Next: React Login UI Integration.
