from fastapi import FastAPI, Depends
from app.models.user import User
from app.database.connection import engine, Base
from fastapi.middleware.cors import CORSMiddleware

from app.controllers.auth_controller import router as auth_router

from app.core.dependencies import get_current_user


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="SmartSplit Authentication Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/")
def root():

    return {
        "message": "SmartSplit Auth Service is running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


@app.get("/auth/me")
def get_profile(
    current_user=Depends(get_current_user)
):

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }