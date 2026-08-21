from fastapi import APIRouter , Depends , WebSocket, WebSocketDisconnect
from database.database import get_db
from sqlalchemy.orm import Session
from schemas.message import MessageResponse
from services.message import get_previous_messages_db
from websocketmanager.websocketmanager import WebSocketManager
from services.security import verify_access_token

router = APIRouter(prefix="/chat")

manager = WebSocketManager()

@router.get("/previous_messages", response_model=list[MessageResponse])
def get_previous_messages(db: Session = Depends(get_db)):
    return get_previous_messages_db(db)

@router.websocket("/ws")
async def chat_ws(ws: WebSocket, db: Session = Depends(get_db)):

    print(")__)__)()_( WebSocket __()()()")

    await ws.accept()

    try:
        data = await ws.receive_json()
        if data["type"] != "auth":
            await ws.close()
            return
        
        token = data["token"]
        user_id = verify_access_token(token)
        if user_id is None:
            await ws.close()
            return
        
        manager.connect(ws, user_id)

        await manager.notify_number_online()

        while True:
            data = await ws.receive_json()

            await manager.handle_client_message(ws, db, data)

    except WebSocketDisconnect:
        manager.disconnect(ws)

