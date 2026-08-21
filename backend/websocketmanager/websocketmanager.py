from fastapi import WebSocket
import json
from datetime import datetime
from schemas.message import MessageSchema
from services.message import store_message_db

class WebSocketManager:
    def __init__(self):
        self.connections = []

    def connect(self, ws: WebSocket, user_id: int):

        self.connections.append({
            "ws": ws,
            "user_id": user_id
        })

        print(f"Client connected")
        print(f"Connections: {len(self.connections)}")

    def disconnect(self, ws: WebSocket):
        for connection in self.connections:
            if connection["ws"] == ws:
                self.connections.remove(connection)
                break

        print(f"Client disconnected")
        print(f"Connections: {len(self.connections)}")


    async def handle_client_message(self, ws: WebSocket, db: Session, data: dict):

        if (data["type"] == "message"):
            msg_time = datetime.utcnow()

            message = MessageSchema(
                sender_id = self.get_id_from_ws(ws),
                content = data["content"],
                time = msg_time
            )

            store_message_db(message, db)

            await self.broadcast_message(ws, message, True)


    async def broadcast_message(self, sender: WebSocket, message: MessageSchema, sould_notify_sender: bool):
        print("<call> broadcast_message")
        for connection in self.connections:
            if sender == connection["ws"] and not sould_notify_sender:
                continue
            await connection["ws"].send_json({
                "type": "message",
                "sender_id": message.sender_id,
                "content": message.content,
                "time": message.time.isoformat()
            })

    async def notify_number_online(self):
        for connection in self.connections:
            json_message = {
                "type": "new-connection",
                "content": str(len(self.connections))
            }

            await connection["ws"].send_json(json_message)
    
    def get_id_from_ws(self, ws: WebSocket) -> int:
        for connection in self.connections:
            if connection["ws"] == ws:
                return connection["user_id"]