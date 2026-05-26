import logging
import json
from typing import Dict, Any, List
from langchain_core.messages import AIMessage, ToolMessage, HumanMessage, SystemMessage
from langchain_core.tools import tool

from app.graph.state import AgentState
from app.services.llm_service import get_llm

# Import tools
from app.tools.geocode import geocode_place
from app.tools.birth_chart import compute_birth_chart
from app.tools.transits import compute_transits
from app.tools.rag_lookup import knowledge_lookup

logger = logging.getLogger(__name__)

# ==========================================
# Tool Definitions for LangChain Binding
# ==========================================

@tool
def tool_geocode_place(place: str) -> str:
    """
    Geocodes a location name to obtain its latitude, longitude, and IANA timezone name.
    Use this when the user specifies a city of birth or location but coordinates are not yet resolved.
    """
    res = geocode_place(place)
    return json.dumps(res)

@tool
def tool_compute_birth_chart(date_str: str, time_str: str, lat: float, lon: float, timezone_str: str) -> str:
    """
    Computes the natal birth chart positions of planets (Sun, Moon, etc.), houses, and Ascendant.
    Input date format should be YYYY/MM/DD (e.g. 1990/08/15) and time format HH:MM (e.g. 14:30).
    """
    res = compute_birth_chart(date_str, time_str, lat, lon, timezone_str)
    return json.dumps(res)

@tool
def tool_compute_transits(natal_chart_data: dict, current_lat: float = 0.0, current_lon: float = 0.0) -> str:
    """
    Computes current planetary positions and compares them to the user's natal chart.
    Useful for answering daily horoscope, transit impact, or current energy questions.
    Input 'natal_chart_data' must be the exact dictionary returned by the compute_birth_chart tool.
    """
    res = compute_transits(natal_chart_data, current_lat, current_lon)
    return json.dumps(res)

@tool
def tool_knowledge_lookup(query: str) -> str:
    """
    Performs keyword/semantic search in local astrology reference notes.
    Use this to look up specific meanings of signs, planet meanings, houses, or Saturn lessons.
    """
    res = knowledge_lookup(query)
    return json.dumps(res)

# List of tools to bind
ASTRO_TOOLS = [tool_geocode_place, tool_compute_birth_chart, tool_compute_transits, tool_knowledge_lookup]

# ==========================================
# Node Implementations
# ==========================================

def refusal_node(state: AgentState) -> Dict[str, Any]:
    """
    Unsafe/invalid request node. Formulates a polite, warm safety refusal.
    """
    messages = state.get("messages", [])
    refusal_msg = (
        "✨ I am here to help guide you through the psychological, spiritual, and evolutionary dimensions of astrology. "
        "However, I cannot provide medical diagnosis, absolute financial/investment advice, legal predictions, "
        "or calculate details for invalid parameters (such as future dates or non-terrestrial locations). "
        "Please let me know if you would like to explore your personal placements, daily transits, or career potentials from a spiritual lens!"
    )
    
    return {
        "messages": messages + [{"role": "assistant", "content": refusal_msg}],
        "next_step": "end"
    }

async def agent_node(state: AgentState) -> Dict[str, Any]:
    """
    Reasoning node. Binds tools to the LLM and runs a step of the agent.
    """
    logger.info("Entering agent node")
    messages = state.get("messages", [])
    birth_data = state.get("birth_data", {})
    next_step = state.get("next_step", "general_question")
    current_steps = state.get("steps", 0)
    
    logger.info(f"Current reasoning steps: {current_steps}")
    if current_steps >= 5:
        logger.warning("Max reasoning steps (5) reached, forcing termination.")
        warning_msg = {
            "role": "assistant",
            "content": "✨ I have completed my analysis limit for this query. Let me know if you would like me to clarify these details!"
        }
        return {
            "messages": messages + [warning_msg],
            "steps": current_steps
        }
        
    new_steps = current_steps + 1
    
    # Format messages for LangChain
    langchain_messages = []
    
    # System prompt based on intent
    system_instruction = (
        "You are AstroAgent, a premium, warm, deeply intuitive Vedic and Western Astrologer.\n"
        "Your goal is to provide insightful, uplifting, and psychologically grounded astrological readings.\n"
        "Follow these rules strictly:\n"
        "1. NEVER make up or hallucinate planet signs, degrees, or house placements. Always use the math tools provided.\n"
        "2. If the user asks about their chart but birth details are missing, ask for: Date of Birth (YYYY/MM/DD), Time of Birth (HH:MM), and City of Birth.\n"
        "3. When you receive a city name, use `tool_geocode_place` first to get coordinates and timezone.\n"
        "4. Once coordinates/timezone are resolved, compute the chart using `tool_compute_birth_chart`.\n"
        "5. For transit queries, retrieve the user's birth chart first, then run `tool_compute_transits`.\n"
        "6. Use `tool_knowledge_lookup` to ground your advice in verified astrological descriptions (e.g. for Saturn or houses).\n"
        "7. Refuse medical, legal, and absolute financial predictions gracefully and guide users towards emotional and spiritual self-discovery.\n"
        "8. Do not repeatedly call the same tool if the required information already exists in state or was already provided.\n"
        f"Context: The current user birth data stored is: {json.dumps(birth_data)}\n"
        f"Intent focus: {next_step}\n"
    )
    
    langchain_messages.append(SystemMessage(content=system_instruction))
    
    for msg in messages:
        role = msg.get("role")
        content = msg.get("content", "")
        
        # Handle different message roles
        if role == "system":
            langchain_messages.append(SystemMessage(content=content))
        elif role == "user":
            langchain_messages.append(HumanMessage(content=content))
        elif role == "assistant":
            # Map tools back if present
            tool_calls = msg.get("tool_calls")
            if tool_calls:
                langchain_messages.append(AIMessage(content=content, tool_calls=tool_calls))
            else:
                langchain_messages.append(AIMessage(content=content))
        elif role == "tool":
            langchain_messages.append(ToolMessage(content=content, tool_call_id=msg.get("tool_call_id", "")))

    # Get LLM and bind tools
    llm = get_llm(temperature=0.2)
    llm_with_tools = llm.bind_tools(ASTRO_TOOLS)
    
    response = await llm_with_tools.ainvoke(langchain_messages)
    
    # Format response message as dictionary
    response_dict = {
        "role": "assistant",
        "content": response.content
    }
    if response.tool_calls:
        response_dict["tool_calls"] = response.tool_calls
        logger.info(f"Agent requested tool calls: {[tc.get('name') for tc in response.tool_calls]}")
        
    return {
        "messages": messages + [response_dict],
        "steps": new_steps
    }

async def tool_execution_node(state: AgentState) -> Dict[str, Any]:
    """
    Executes the requested tool calls and appends the result messages to state.
    """
    logger.info("Entering tool execution node")
    messages = state.get("messages", [])
    if not messages:
        return {}
        
    last_msg = messages[-1]
    tool_calls = last_msg.get("tool_calls", [])
    new_messages = list(messages)
    tool_result_update = state.get("tool_result", {})
    birth_data_update = dict(state.get("birth_data", {}))
    
    tool_map = {
        "tool_geocode_place": tool_geocode_place,
        "tool_compute_birth_chart": tool_compute_birth_chart,
        "tool_compute_transits": tool_compute_transits,
        "tool_knowledge_lookup": tool_knowledge_lookup
    }
    
    for call in tool_calls:
        name = call.get("name")
        args = call.get("args")
        call_id = call.get("id")
        
        logger.info(f"Executing tool '{name}' with args: {args}")
        
        if name in tool_map:
            func = tool_map[name]
            try:
                # Run tool synchronously (since our tools are synchronous wrapper functions)
                result_str = func.invoke(args)
                
                # Try to parse result for storage
                parsed_res = json.loads(result_str)
                tool_result_update[name] = parsed_res
                
                # If geocoding or birth chart calculation succeeded, cache it in birth_data state
                if name == "tool_geocode_place" and parsed_res.get("success"):
                    birth_data_update.update({
                        "latitude": parsed_res.get("lat"),
                        "longitude": parsed_res.get("lon"),
                        "timezone": parsed_res.get("timezone"),
                        "resolved_place": args.get("place")
                    })
                elif name == "tool_compute_birth_chart" and parsed_res.get("success"):
                    birth_data_update.update({
                        "dob": parsed_res.get("raw_details", {}).get("date"),
                        "time": parsed_res.get("raw_details", {}).get("time"),
                        "chart": parsed_res
                    })
            except Exception as e:
                logger.error(f"Error running tool '{name}': {str(e)}")
                result_str = json.dumps({"success": False, "error": str(e)})
                
            new_messages.append({
                "role": "tool",
                "content": result_str,
                "tool_call_id": call_id,
                "name": name
            })
            
    return {
        "messages": new_messages,
        "tool_result": tool_result_update,
        "birth_data": birth_data_update
    }
