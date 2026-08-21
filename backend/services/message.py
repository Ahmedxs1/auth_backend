from schemas.message import MessageSchema
from sqlalchemy.orm import Session
from models.models import Message

def get_previous_messages_db(db: Session) -> list[MessageSchema]:
    messages = db.query(Message).all()

    result = []

    for message in messages:
        result.append(MessageSchema(
            sender_id=message.sender_id,
            content=message.content,
            time=message.time,
        ))
        
    return result

def store_message_db(message: MessageSchema, db: Session):
    db_message = Message(
        sender_id=message.sender_id,
        content=message.content,
        time=message.time
    )

    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    return 