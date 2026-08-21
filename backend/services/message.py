from schemas.message import MessageDb , MessageResponse
from sqlalchemy.orm import Session
from models.models import Message , User

def get_previous_messages_db(db: Session) -> list[MessageResponse]:
    messages = db.query(Message).all()

    result = []

    for message in messages:
        result.append(MessageResponse(
            sender_id=message.sender_id,
            sender_name=get_name_from_id(message.sender_id, db),
            content=message.content,
            time=message.time,
        ))
        
    return result

def store_message_db(message: MessageDb, db: Session):
    db_message = Message(
        sender_id=message.sender_id,
        content=message.content,
        time=message.time
    )

    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    return 

def get_name_from_id(user_id: int, db: Session):
    user = db.query(User).filter(
        User.user_id == user_id
    ).first()

    if user is None:
        return None

    return user.username