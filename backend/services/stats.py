from schemas.user import UserResponse
from sqlalchemy.orm import Session
from models.models import User


def get_users_db(db: Session) -> list[UserResponse]:
    users = db.query(User).all()

    result = []
    for user in users:
        result.append(UserResponse(
            user_id=user.user_id,
            username=user.username,
            email=user.email
        ))

    return result