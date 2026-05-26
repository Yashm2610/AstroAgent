from app.graph.state import AgentState

def route_after_router(state: AgentState) -> str:
    """
    Decides which node to route to after intent classification.
    """
    next_step = state.get("next_step", "general_question")
    if next_step == "invalid":
        return "refusal"
    return "agent"

def route_after_agent(state: AgentState) -> str:
    """
    Decides whether to proceed to tool execution or finalize the run.
    """
    messages = state.get("messages", [])
    if not messages:
        return "__end__"
        
    last_msg = messages[-1]
    
    # Check for tool calls in the last message
    if isinstance(last_msg, dict):
        if last_msg.get("tool_calls"):
            return "tools"
    elif hasattr(last_msg, "tool_calls") and last_msg.tool_calls:
        return "tools"
        
    return "__end__"
