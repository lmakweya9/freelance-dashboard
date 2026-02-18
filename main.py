import os
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

# --- DATABASE CONFIG ---
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- SECURITY ---
SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- MODELS ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    company_name = Column(String)
    # Cascade ensure projects are deleted if client is deleted
    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    budget = Column(Float, default=0.0)
    status = Column(String, default="In Progress")
    client_id = Column(Integer, ForeignKey("clients.id"))
    owner = relationship("Client", back_populates="projects")

Base.metadata.create_all(bind=engine)

# --- APP SETUP ---
app = FastAPI()
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

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            db.add(User(username="admin", hashed_password=pwd_context.hash("password123")))
            db.commit()
    finally:
        db.close()

# --- ROUTES ---
@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = jwt.encode({"sub": user.username, "exp": datetime.utcnow() + timedelta(hours=24)}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

@app.get("/clients/")
def get_clients(db: Session = Depends(get_db)):
    return db.query(Client).all()

@app.post("/clients/")
def create_client(client_data: dict, db: Session = Depends(get_db)):
    if db.query(Client).filter(Client.email == client_data.get("email")).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    new_client = Client(**client_data)
    db.add(new_client)
    db.commit()
    return {"status": "success"}

@app.delete("/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(client)
    db.commit()
    return {"status": "deleted"}

@app.post("/projects/")
def create_project(project_data: dict, db: Session = Depends(get_db)):
    project_data["budget"] = float(project_data.get("budget", 0))
    new_project = Project(**project_data)
    db.add(new_project)
    db.commit()
    return {"status": "success"}
