from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

# Database Setup
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
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
    budget = Column(Float, default=0.0) # <--- New Field
    client_id = Column(Integer, ForeignKey("clients.id"))
    owner = relationship("Client", back_populates="projects")

Base.metadata.create_all(bind=engine)

# Pydantic Schemas
class ProjectBase(BaseModel):
    title: str
    budget: float = 0.0 # <--- New Field

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

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

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

@app.patch("/projects/{project_id}/status")
def toggle_status(project_id: int, db: Session = Depends(get_db)):
    proj = db.query(Project).filter(Project.id == project_id).first()
    proj.status = "Completed" if proj.status == "In Progress" else "In Progress"
    db.commit()
    return {"status": proj.status}

@app.delete("/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    db.delete(client)
    db.commit()
    return {"message": "Deleted"}