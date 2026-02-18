import os
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext

# --- PASSWORD HASHING SETUP ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- DATABASE CONFIG ---
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

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
    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    budget = Column(Float, default=0.0)
    status = Column(String, default="Active")
    client_id = Column(Integer, ForeignKey("clients.id"))
    owner = relationship("Client", back_populates="projects")

# Create tables
Base.metadata.create_all(bind=engine)

# --- AUTO-CREATE ADMIN USER ---
db = SessionLocal()
admin_exists = db.query(User).filter(User.username == "admin").first()
if not admin_exists:
    new_user = User(username="admin", hashed_password=pwd_context.hash("password"))
    db.add(new_user)
    db.commit()
db.close()

# --- SCHEMAS ---
class AuthRequest(BaseModel):
    username: str
    password: str

# --- APP SETUP ---
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

# --- AUTH ROUTES ---
@app.post("/register")
def register(data: AuthRequest, db: Session = Depends(get_db)):
    user_exists = db.query(User).filter(User.username == data.username).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="Username already taken")
    new_user = User(username=data.username, hashed_password=pwd_context.hash(data.password))
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}

@app.post("/login")
def login(data: AuthRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    # verify the hashed password
    if not user or not pwd_context.verify(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"access_token": "user-session-token", "token_type": "bearer"}

# --- DATA ROUTES ---
@app.get("/clients/")
def get_clients(db: Session = Depends(get_db)):
    return db.query(Client).all()

@app.post("/clients/")
def create_client(data: dict, db: Session = Depends(get_db)):
    new_client = Client(**data)
    db.add(new_client)
    db.commit()
    return new_client

@app.post("/projects/")
def create_project(data: dict, db: Session = Depends(get_db)):
    new_project = Project(**data)
    db.add(new_project)
    db.commit()
    return new_project
