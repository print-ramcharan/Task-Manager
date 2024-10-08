from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, Integer, String, create_engine, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
from typing import List, Optional
from enum import Enum
from sqlalchemy import Column, Integer, String, Enum as SQLAEnum



# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class TaskStatus(str, Enum):
    todo = "todo"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    on_hold = "on_hold"
    pending = "Pending"
    in_progress = "In Progress"
    completed = "Completed"
    empty = ""
      # Add more as needed

# Define the models
class Member(Base):
    __tablename__ = "members"

    email = Column(String, primary_key=True, index=True)
    name = Column(String)
    tasks = relationship("Task", secondary="task_members", back_populates="members")

class TaskMember(Base):
    __tablename__ = "task_members"

    task_id = Column(Integer, ForeignKey("tasks.id"), primary_key=True)
    member_email = Column(String, ForeignKey("members.email"), primary_key=True)

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, index=True)
    description = Column(String)
    priority = Column(String)
    deadline = Column(String)
    duration = Column(String)
    status = Column(SQLAEnum(TaskStatus), index=True)
    subtasks = Column(JSON, nullable=True)

    members = relationship("Member", secondary="task_members", back_populates="tasks")
    timeline = relationship("Timeline", back_populates="task")

class Timeline(Base):
    __tablename__ = "timeline"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    update_time = Column(String)
    description = Column(String)

    task = relationship("Task", back_populates="timeline")

# Create the database tables
Base.metadata.create_all(bind=engine)

# Define the FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the schemas
class MemberResponse(BaseModel):
    email: EmailStr
    name: Optional[str] = None

class TaskBase(BaseModel):
    title: str
    description: str
    priority: str
    deadline: str
    duration: str
    status: str
    subtasks: Optional[List[str]] = []

class TaskCreate(TaskBase):
    members: Optional[List[EmailStr]] = []

class TaskUpdate(TaskBase):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    deadline: Optional[str] = None
    duration: Optional[str] = None
    status: Optional[str] = None
    subtasks: Optional[List[str]] = None
    members: Optional[List[EmailStr]] = None

class TaskResponse(TaskBase):
    id: int
    members: List[MemberResponse]

class TimelineCreate(BaseModel):
    task_id: int
    update_time: str
    description: str

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API Endpoints
@app.post("/tasks/", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(**task.dict(exclude={"members"}))
    db.add(db_task)
    
    # Add members
    if task.members:
        for email in task.members:
            member = db.query(Member).filter(Member.email == email).first()
            if not member:
                member = Member(email=email)
                db.add(member)
            db_task.members.append(member)
    
    db.commit()
    db.refresh(db_task)
    
    # Return task with members and ID
    return {
        "id": db_task.id,
        **task.dict(exclude={"members"}),
        "members": [{"email": m.email, "name": m.name} for m in db_task.members]
    }

@app.get("/tasks/", response_model=List[TaskResponse])
def read_tasks(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    tasks = db.query(Task).offset(skip).limit(limit).all()
    
    # Convert tasks to include members and ID
    return [
        {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "priority": task.priority,
            "deadline": task.deadline,
            "duration": task.duration,
            "status": task.status,
            "members": [{"email": m.email, "name": m.name} for m in task.members]
        }
        for task in tasks
    ]

@app.get("/tasks/{task_id}", response_model=TaskResponse)
def read_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Convert task to include members and ID
    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "priority": task.priority,
        "deadline": task.deadline,
        "duration": task.duration,
        "status": task.status,
        "members": [{"email": m.email, "name": m.name} for m in task.members]
    }

@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task.dict(exclude_unset=True)
    
    # Update non-relationship fields
    for key, value in update_data.items():
        if key not in ["members"]:
            setattr(db_task, key, value)

    # Update members
    if task.members is not None:
        current_members = {member.email for member in db_task.members}
        new_members = set(task.members)
        
        to_add = new_members - current_members
        to_remove = current_members - new_members
        
        # Remove members
        for email in to_remove:
            member = db.query(Member).filter(Member.email == email).first()
            if member:
                db_task.members.remove(member)
        
        # Add members
        for email in to_add:
            member = db.query(Member).filter(Member.email == email).first()
            if not member:
                member = Member(email=email)
                db.add(member)
            db_task.members.append(member)

    db.commit()
    db.refresh(db_task)
    
    # Return updated task with members and ID
    return {
        "id": db_task.id,
        "title": db_task.title,
        "description": db_task.description,
        "priority": db_task.priority,
        "deadline": db_task.deadline,
        "duration": db_task.duration,
        "status": db_task.status,
        "members": [{"email": m.email, "name": m.name} for m in db_task.members]
    }


@app.delete("/tasks/{task_id}", response_model=TaskResponse)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    
    # Return task with members and ID before deletion
    return {
        "id": db_task.id,
        "title": db_task.title,
        "description": db_task.description,
        "priority": db_task.priority,
        "deadline": db_task.deadline,
        "duration": db_task.duration,
        "status": db_task.status,
        "members": [{"email": m.email, "name": m.name} for m in db_task.members]
    }

@app.post("/timeline/", response_model=TimelineCreate)
def create_timeline(timeline: TimelineCreate, db: Session = Depends(get_db)):
    db_timeline = Timeline(**timeline.dict())
    db.add(db_timeline)
    db.commit()
    db.refresh(db_timeline)
    return db_timeline

@app.get("/tasks/status/{Completed}", response_model=List[TaskResponse])
def get_tasks_by_status(status: str, db: Session = Depends(get_db)):
    if status not in [e.value for e in TaskStatus]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    tasks = db.query(Task).filter(Task.status == status).all()
    return [
        {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "priority": task.priority,
            "deadline": task.deadline,
            "duration": task.duration,
            "status": task.status,
            "members": [{"email": m.email, "name": m.name} for m in task.members]
        }
        for task in tasks
    ]


@app.get("/tasks/status/{status}", response_model=List[TaskResponse])
def get_tasks_by_status(status: str, db: Session = Depends(get_db)):
    if status not in [e.value for e in TaskStatus]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    tasks = db.query(Task).filter(Task.status != 'Completed').all()
    return [
        {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "priority": task.priority,
            "deadline": task.deadline,
            "duration": task.duration,
            "status": task.status,
            "members": [{"email": m.email, "name": m.name} for m in task.members]
        }
        for task in tasks
    ]

