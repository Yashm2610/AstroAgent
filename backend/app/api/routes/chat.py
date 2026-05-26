import logging
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from app.api.schemas.chat_schema import ChatRequest, ChatResponse
from app.graph.builder import graph
from app.services.db_service import get_chat_history, clear_chat_history, get_birth_details
from app.services.streaming import chat_stream_generator

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Synchronous (non-streaming) chat endpoint.
    Retrieves history and runs the LangGraph to completion.
    """
    user_id = request.user_id or "default_user"
    
    # Retrieve chat history from SQLite
    history = get_chat_history(user_id)
    
    # Retrieve birth data from database if not explicitly sent in request
    birth_data = request.birth_data or {}
    if not birth_data:
        saved_details = get_birth_details(user_id)
        if saved_details:
            birth_data = saved_details
            
    initial_state = {
        "messages": list(history) + [{"role": "user", "content": request.message}],
        "birth_data": birth_data,
        "tool_result": {},
        "next_step": ""
    }
    
    try:
        result = await graph.ainvoke(initial_state)
        messages = result.get("messages", [])
        
        # Get final response content
        assistant_messages = [m for m in messages if m.get("role") == "assistant"]
        response_text = assistant_messages[-1].get("content", "") if assistant_messages else "No response generated."
        
        # Save messages to database
        from app.services.db_service import save_chat_message
        save_chat_message(user_id, "user", request.message)
        save_chat_message(user_id, "assistant", response_text)
        
        return ChatResponse(
            response=response_text,
            messages=messages
        )
    except Exception as e:
        logger.error(f"Graph execution failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Graph execution failed: {str(e)}")

@router.get("/chat/stream")
async def chat_stream_endpoint(
    message: str = Query(..., description="The user message"),
    user_id: str = Query(..., description="The user session ID")
):
    """
    EventSource Server-Sent Events (SSE) streaming endpoint.
    Streams back tokens and active tool calls.
    """
    logger.info(f"Streaming request from {user_id}: '{message}'")
    
    # Fetch user's saved birth chart to provide context to the agent state
    birth_data = get_birth_details(user_id)
    
    return StreamingResponse(
        chat_stream_generator(message, user_id, birth_data),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@router.get("/chat/history")
async def get_user_chat_history(user_id: str):
    """Retrieves chat message history for the user session."""
    history = get_chat_history(user_id)
    return {"success": True, "history": history}

@router.post("/chat/clear")
async def clear_user_chat(user_id: str):
    """Clears the chat history for the user session."""
    clear_chat_history(user_id)
    return {"success": True, "detail": "Chat history cleared."}
