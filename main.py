import os
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- DATABASE CONFIG ---
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- MODELS ---
class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    company_name = Column(String)
    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    budget = Column(Float, default=0.0)
    status = Column(String, default="Active")
    client_id = Column(Integer, ForeignKey("clients.id"))
    owner = relationship("Client", back_populates="projects")

Base.metadata.create_all(bind=engine)

# --- SCHEMAS ---
class LoginRequest(BaseModel):
    username: str
    password: str

# --- APP SETUP ---
app = FastAPI()

# This is critical for Vercel -> Render communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ROUTES ---

@app.get("/")
def read_root():
    return {"status": "Backend is running successfully"}

@app.post("/login")
@app.post("/login/")
async def login(data: LoginRequest):
    if data.username == "admin" and data.password == "password":
        return {"access_token": "valid-session-token", "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid username or password")

@app.get("/clients/")
def get_clients(db: Session = Depends(get_db)):
    clients = db.query(Client).all()
    return clients if clients else []

@app.post("/clients/")
def create_client(client_data: dict, db: Session = Depends(get_db)):
    new_client = Client(**client_data)
    db.add(new_client)
    db.commit()
    return {"status": "success"}

@app.delete("/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if client:
        db.delete(client)
        db.commit()
    return {"status": "deleted"}

@app.post("/projects/")
def create_project(project_data: dict, db: Session = Depends(get_db)):
    new_project = Project(**project_data)
    db.add(new_project)
    db.commit()
    return {"status": "success"}

@app.patch("/projects/{project_id}/toggle")
def toggle_project_status(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404)
    
    cycle = ["Active", "Completed", "Abandoned"]
    current = project.status if project.status in cycle else "Active"
    project.status = cycle[(cycle.index(current) + 1) % 3]
    
    db.commit()
    db.refresh(project)
    return {"status": project.status}
