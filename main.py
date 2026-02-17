from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

# --- 1. DATABASE SETUP ---
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- 2. SECURITY CONFIG ---
SECRET_KEY = "your_super_secret_key_change_this"
ALGORITHM = "HS256"
# Note: Ensure bcrypt==4.0.1 is installed to avoid passlib conflicts
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- 3. MODELS ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    company_name = Column(String, nullable=True)
    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    status = Column(String, default="In Progress")
    budget = Column(Float, default=0.0)
    client_id = Column(Integer, ForeignKey("clients.id"))
    owner = relationship("Client", back_populates="projects")

Base.metadata.create_all(bind=engine)

# --- 4. SCHEMAS ---
class ProjectBase(BaseModel):
    title: str
    budget: float = 0.0

class ProjectCreate(ProjectBase):
    client_id: int

class ProjectSchema(ProjectBase):
    id: int
    status: str
    class Config: from_attributes = True

class ClientCreate(BaseModel):
    name: str
    email: str
    company_name: str = None

class ClientSchema(BaseModel):
    id: int
    name: str
    email: str
    company_name: str = None
    projects: List[ProjectSchema] = []
    class Config: from_attributes = True

# --- 5. admin PASSWORD doesnt get deleted ---
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        db.add(User(username="admin", hashed_password=hash_password("password123")))
        db.commit()
    db.close()

# --- 5. APP & ROUTES ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/clients/", response_model=ClientSchema)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    db_client = Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@app.get("/clients/", response_model=List[ClientSchema])
def get_clients(db: Session = Depends(get_db)):
    return db.query(Client).all()

@app.post("/projects/", response_model=ProjectSchema)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.delete("/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    db.delete(client)
    db.commit()
    return {"message": "Deleted"}