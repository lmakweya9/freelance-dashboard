import os
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Float, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext

# --- 1. SCHEMAS ---
class AuthRequest(BaseModel):
    username: str
    password: str

class ClientCreate(BaseModel):
    name: str
    email: str
    company_name: str

class ProjectCreate(BaseModel):
    title: str
    budget: float
    client_id: int

# --- 2. SECURITY & DB SETUP ---
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- 3. MODELS ---
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
    # This 'relationship' allows projects to be fetched with the client automatically
    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan", lazy="joined")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    budget = Column(Float, default=0.0)
    status = Column(String, default="Active")
    client_id = Column(Integer, ForeignKey("clients.id"))
    owner = relationship("Client", back_populates="projects")

Base.metadata.create_all(bind=engine)

# Database Init (Admin and Migration)
def init_db():
    db = SessionLocal()
    try:
        if "postgresql" in DATABASE_URL:
            db.execute(text('ALTER TABLE users ADD COLUMN IF NOT EXISTS hashed_password VARCHAR'))
            db.commit()
        if not db.query(User).filter(User.username == "admin").first():
            db.add(User(username="admin", hashed_password=pwd_context.hash("password")))
            db.commit()
    finally:
        db.close()

init_db()

# --- 4. APP & ROUTES ---
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@app.post("/login")
def login(data: AuthRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not pwd_context.verify(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": "valid-token"}

@app.get("/clients/")
def get_clients(db: Session = Depends(get_db)):
    return db.query(Client).all()

@app.post("/clients/")
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    new_client = Client(**client.dict())
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    return new_client

@app.delete("/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    target = db.query(Client).filter(Client.id == client_id).first()
    if target:
        db.delete(target)
        db.commit()
    return {"status": "success"}

@app.post("/projects/")
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = Project(
        title=project.title,
        budget=project.budget,
        client_id=project.client_id
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project
