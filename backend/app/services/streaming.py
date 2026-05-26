import json
import logging
from typing import AsyncGenerator
from app.graph.builder import graph
from app.services.db_service import get_chat_history, save_chat_message

logger = logging.getLogger(__name__)

async def chat_stream_generator(message: str, user_id: str, birth_data: dict) -> AsyncGenerator[str, None]:
    """
    Streams assistant tokens and active tool executions from the LangGraph execution flow
    in Server-Sent Events (SSE) format, persisting user and assistant messages in the database.
    """
    # Load chat history from SQLite database
    history = get_chat_history(user_id)
    
    # Format messages for LangGraph input state
    messages = list(history) + [{"role": "user", "content": message}]
    
    initial_state = {
        "messages": messages,
        "birth_data": birth_data or {},
        "tool_result": {},
        "next_step": ""
    }
    
    assistant_text = ""
    
    try:
        # Retrieve graph events using the astream_events engine
        async for event in graph.astream_events(initial_state, version="v2"):
            event_type = event.get("event")
            
            # 1. Capture chat model streams
            if event_type == "on_chat_model_stream":
                chunk = event.get("data", {}).get("chunk")
                if chunk and hasattr(chunk, "content") and chunk.content:
                    token = chunk.content
                    assistant_text += token
                    yield f"event: token\ndata: {json.dumps(token)}\n\n"
                    
            # 2. Capture tool starts
            elif event_type == "on_tool_start":
                tool_name = event.get("name")
                logger.info(f"Tool execution started: {tool_name}")
                yield f"event: tool_start\ndata: {json.dumps(tool_name)}\n\n"
                
            # 3. Capture tool completions
            elif event_type == "on_tool_end":
                tool_name = event.get("name")
                logger.info(f"Tool execution ended: {tool_name}")
                yield f"event: tool_end\ndata: {json.dumps(tool_name)}\n\n"
                
        # Persist conversation in SQLite
        save_chat_message(user_id, "user", message)
        if assistant_text:
            save_chat_message(user_id, "assistant", assistant_text)
            
        yield "event: done\ndata: {}\n\n"
        
    except Exception as e:
        logger.error(f"Error in chat_stream_generator: {str(e)}", exc_info=True)
        yield f"event: error\ndata: {json.dumps(f'Streaming error: {str(e)}')}\n\n"
