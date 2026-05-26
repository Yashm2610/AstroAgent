import os
import logging
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()
logger = logging.getLogger(__name__)

def get_llm(temperature: float = 0.2) -> ChatGroq:
    """
    Initializes and returns the ChatGroq LLM instance.
    Falls back to a standard model name if not specified.
    """
    api_key = os.getenv("GROQ_API_KEY")
    # Standard high-performance Groq model
    model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    
    if not api_key:
        logger.error("GROQ_API_KEY environment variable is not set!")
        raise ValueError("GROQ_API_KEY environment variable is missing. Please check your .env file.")
        
    return ChatGroq(
        model=model,
        api_key=api_key,
        temperature=temperature
    )
