from langgraph.graph import StateGraph, START, END
from app.graph.state import AgentState
from app.graph.nodes import agent_node, tool_execution_node, refusal_node
from app.graph.router import router_node
from app.graph.edges import route_after_router, route_after_agent

def build_graph():
    workflow = StateGraph(AgentState)
    
    # Register all nodes
    workflow.add_node("router", router_node)
    workflow.add_node("agent", agent_node)
    workflow.add_node("tools", tool_execution_node)
    workflow.add_node("refusal", refusal_node)
    
    # Establish entry point
    workflow.add_edge(START, "router")
    
    # Conditional edge after router node
    workflow.add_conditional_edges(
        "router",
        route_after_router,
        {
            "agent": "agent",
            "refusal": "refusal"
        }
    )
    
    # Refusal node ends the workflow directly
    workflow.add_edge("refusal", END)
    
    # Conditional edge after agent node (can route to tools or end)
    workflow.add_conditional_edges(
        "agent",
        route_after_agent,
        {
            "tools": "tools",
            "__end__": END
        }
    )
    
    # Re-route from tools back to the agent reasoning node
    workflow.add_edge("tools", "agent")
    
    return workflow.compile()

# Global compiled graph
graph = build_graph()
