from typing import TypedDict, List, Dict, Any

class AgentState(TypedDict):
    messages: List[Dict[str, Any]]
    birth_data: Dict[str, Any]
    tool_result: Dict[str, Any]
    next_step: str
    steps: int
