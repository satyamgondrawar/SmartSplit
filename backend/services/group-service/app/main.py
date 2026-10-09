from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models.group import Group
from app.models.group_member import GroupMember
from app.controllers.group_controller import router
from app.models.group_invite import GroupInvite
from app.routes.group_invite_routes import router as group_invite_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartSplit Group Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(group_invite_router)


@app.get("/")
def root():
    return {"message": "SmartSplit Group Service is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}
