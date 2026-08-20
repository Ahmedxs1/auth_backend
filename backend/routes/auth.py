from fastapi import APIRouter , Depends
from database.database import get_db
from sqlalchemy.orm import Session
from services.auth import register_user_db , auth_user_db
from schemas.user import UserRegister , UserResponse , UserLogin

router = APIRouter(prefix="/auth")

@router.post("/register", response_model=UserResponse)
def register_user(data: UserRegister, db: Session = Depends(get_db)):
    return register_user_db(data, db)

@router.post("/login", response_model=UserResponse)
def auth_user(data: UserLogin, db: Session = Depends(get_db)):
    return auth_user_db(data, db)