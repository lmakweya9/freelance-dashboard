import os
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Float, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

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

# --- DATABASE MIGRATION LOGIC ---
Base.metadata.create_all(bind=engine)

def migrate_db():
    db = SessionLocal()
    try:
        # Manually add hashed_password column if it doesn't exist (Postgres fix)
        db.execute(text('ALTER TABLE users ADD COLUMN IF NOT EXISTS hashed_password VARCHAR'))
        db.commit()
        
        # Ensure admin user exists
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            new_user = User(username="admin", hashed_password=pwd_context.hash("password"))
            db.add(new_user)
            db.commit()
    except Exception as e:
        print(f"Migration Note: {e}")
    finally:
        db.close()

migrate_db()

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@app.post("/register")
def register(data: AuthRequest, db: Session = Depends(get_db)):
    # ... (same as previous)
    pass

@app.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.get("username")).first()
    if not user or not pwd_context.verify(data.get("password"), user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": "secret-token", "token_type": "bearer"}

# Add your existing Client/Project GET/POST routes here
