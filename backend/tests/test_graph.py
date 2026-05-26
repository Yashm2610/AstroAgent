import sys
import os
import asyncio

# Ensure app directory is in Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.graph.builder import graph

async def test_echo():
    print("Testing LangGraph Echo Agent...")
    initial_state = {
        "messages": [{"role": "user", "content": "Hello AstroAgent!"}],
        "birth_data": {},
        "tool_result": {},
        "next_step": ""
    }
    
    result = await graph.ainvoke(initial_state)
    messages = result.get("messages", [])
    
    print("\nConversation flow:")
    for msg in messages:
        print(f"  [{msg.get('role').upper()}]: {msg.get('content')}")
    
    assert len(messages) == 2, f"Expected 2 messages, got {len(messages)}"
    assert messages[1]["role"] == "assistant", f"Expected assistant role, got {messages[1]['role']}"
    assert messages[1]["content"] == "Echo: Hello AstroAgent!", f"Expected echo response, got {messages[1]['content']}"
    print("\nResult: SUCCESS — LangGraph echo agent is working correctly!")

if __name__ == "__main__":
    asyncio.run(test_echo())
