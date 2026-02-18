# 🚀 Professional Freelance Management Console

A sleek, high-performance SaaS dashboard designed for freelancers to manage clients, track project pipelines, and monitor revenue in real-time. Built with a modern dark-mode aesthetic and a robust FastAPI/React architecture.



## 🌟 Key Features
* **Dynamic Client Management**: Add, view, and delete clients with a responsive grid layout.
* **Project Orchestration**: Assign multiple projects to specific clients with dedicated budget tracking.
* **Real-time Analytics**: Instant calculation of total revenue, active projects, and client count.
* **Premium UI/UX**: 
    * Smooth hover interactions with blue "glow" effects.
    * Mobile-responsive design using CSS Grid and Flexbox.
    * SaaS-style Authentication (Sign In/Sign Up).
* **Robust Backend**: Built with FastAPI, utilizing SQL Alchemy for relational data mapping and PBKDF2 for secure password hashing.

---

## 🛠️ Technical Stack

### Frontend
* **React.js**: Functional components and Hooks (`useState`, `useEffect`).
* **Lucide-React**: Minimalist, consistent iconography.
* **Axios**: Seamless API communication.
* **CSS-in-JS**: Custom styling with modern transitions and micro-interactions.

### Backend
* **FastAPI**: High-performance Python web framework.
* **SQLAlchemy**: ORM for PostgreSQL/SQLite management.
* **Passlib**: Secure authentication and password security.
* **Uvicorn/Gunicorn**: Production-grade server deployment.



---

## 🚀 Deployment Status

| Service | Platform | Status |
| :--- | :--- | :--- |
| **Frontend** | Vercel | ✅ Live |
| **Backend API** | Render | ✅ Live |
| **Database** | PostgreSQL | ✅ Connected |

---

## 💻 Local Setup

1. **Clone the repository**:
   ```
   git clone [https://github.com/lmakweya9/freelance-dashboard.git](https://github.com/lmakweya9/freelance-dashboard.git)
    ```
2. **Backend Setup**:
   ```
   cd backend
    pip install -r requirements.txt
    uvicorn main:app --reload
   ```
3. Frontend Setup:
   ```
   cd frontend
   npm install
   npm start
   ```
   
## 🔧 Challenges Overcome
Relational Mapping: Successfully implemented a "One-to-Many" relationship between Clients and Projects to ensure data integrity.
Environment Stability: Solved bcrypt versioning conflicts on Render by pivoting to pbkdf2_sha256 hashing.
Build Optimization: Streamlined ESLint configurations on Vercel to allow for high-speed CI/CD deployments.

Developed with ❤️ by Lesego Makweya
