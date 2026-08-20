from fastapi import APIRouter , Depends
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.user import UserResponse
from services.stats import get_users_db

router = APIRouter(prefix="/stats")

@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)) -> list[UserResponse]:
    return get_users_db(db)