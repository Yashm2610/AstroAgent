from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import chat
from app.api.routes import birth

app = FastAPI(
    title="AstroAgent API", 
    description="Backend API for AstroAgent, powering birth chart math and LangGraph loop.",
    version="1.0.0"
)

# Enable CORS for React frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(chat.router, prefix="/api")
app.include_router(birth.router, prefix="/api")

@app.get("/")
def home():
    return {
        "status": "running", 
        "app": "AstroAgent API",
        "endpoints": {
            "health": "/",
            "chat_stream": "/api/chat/stream",
            "chat_history": "/api/chat/history",
            "birth_details": "/api/birth-details"
        }
    }
