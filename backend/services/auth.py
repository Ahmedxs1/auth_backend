from sqlalchemy.orm import Session
from sqlalchemy import or_

from schemas.user import UserRegister , UserResponse , UserLogin
from models.models import User

from fastapi import HTTPException

from services.security import hash_password , verify_password

def register_user_db(data: UserRegister, db: Session):

    # SELECT * FROM users
    # WHERE username = ... OR email = ...

    user = db.query(User).filter(
        or_(
            User.username == data.username,
            User.email == data.email
        )
    ).first()

    # User already exists
    if user:
        raise HTTPException(status_code=409, detail="User already exists")

    # INSERT INTO users
    user = User(
        username=data.username,
        email=data.email,
        password=hash_password(data.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return UserResponse(
        username=data.username,
        email=data.email
    )

def auth_user_db(data: UserLogin, db: Session) -> UserResponse:

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User does not exist")
    
    if not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid passowrd"
        )
    
    return UserResponse(
        username=user.username,
        email=user.email
    )