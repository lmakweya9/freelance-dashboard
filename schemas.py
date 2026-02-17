from pydantic import BaseModel, EmailStr
from typing import List, Optional

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "In Progress"

class ProjectCreate(ProjectBase):
    client_id: int

class Project(ProjectBase):
    id: int
    class Config:
        from_attributes = True

class ClientBase(BaseModel):
    name: str
    email: EmailStr
    company_name: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    projects: List[Project] = []
    class Config:
        from_attributes = True