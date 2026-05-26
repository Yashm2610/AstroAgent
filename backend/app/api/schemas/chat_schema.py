from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None
    birth_data: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    response: str
    messages: List[Dict[str, Any]]
