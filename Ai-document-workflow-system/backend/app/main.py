import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine, SessionLocal
from .models import User
from .core.security import hash_password
from .routers.auth import router as auth_router
from .routers.invoice import router as invoice_router
from .routers.workflow import router as workflow_router
from .routers.leave_request import router as leave_request_router
from .routers.complaint import router as complaint_router
from .routers.document_hub import router as document_hub_router

load_dotenv()

Path("uploads").mkdir(exist_ok=True)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Document Workflow System Backend")

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        frontend_url,
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def seed_demo_users():
    db = SessionLocal()
    try:
        demo_users = [
            {
                "username": "admin",
                "full_name": "System Admin",
                "email": "admin@example.com",
                "password": "admin123",
                "role": "admin",
            },
            {
                "username": "staff",
                "full_name": "Staff User",
                "email": "staff@example.com",
                "password": "staff123",
                "role": "staff",
            },
            {
                "username": "approver",
                "full_name": "HR Approver",
                "email": "approver@example.com",
                "password": "approver123",
                "role": "approver",
            },
        ]

        for item in demo_users:
            existing = db.query(User).filter(User.username == item["username"]).first()
            if not existing:
                user = User(
                    username=item["username"],
                    full_name=item["full_name"],
                    email=item["email"],
                    password_hash=hash_password(item["password"]),
                    role=item["role"],
                    is_active="true",
                )
                db.add(user)

        db.commit()
    finally:
        db.close()


seed_demo_users()

app.include_router(auth_router)
app.include_router(invoice_router)
app.include_router(leave_request_router)
app.include_router(workflow_router)
app.include_router(complaint_router)
app.include_router(document_hub_router)



@app.get("/")
def read_root():
    return {"message": "Backend is running"}