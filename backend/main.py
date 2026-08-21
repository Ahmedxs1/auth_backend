from fastapi import FastAPI
from routes.auth import router as user_auth_router
from routes.stats import router as user_stats_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:6699",
        "http://127.0.0.1:6699",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_auth_router)
app.include_router(user_stats_router)


from sqlalchemy.orm import Session
from database.database import engine , Base
from models.models import User

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return ({
        "type": "root-response",
        "content": "Hello"
    })