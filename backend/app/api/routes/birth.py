import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.tools.geocode import geocode_place
from app.tools.birth_chart import compute_birth_chart
from app.services.db_service import save_birth_details, get_birth_details

logger = logging.getLogger(__name__)
router = APIRouter()

class BirthDetailsRequest(BaseModel):
    user_id: str
    dob: str         # YYYY/MM/DD
    time: str        # HH:MM
    place: str       # City name

@router.post("/birth-details")
async def save_user_birth_details(request: BirthDetailsRequest):
    """
    Geocodes the location, calculates the natal chart, and saves details to database.
    """
    logger.info(f"Processing birth details for user {request.user_id}: {request.place}")
    
    # 1. Geocode location
    geo_res = geocode_place(request.place)
    if not geo_res.get("success"):
        raise HTTPException(
            status_code=400, 
            detail=geo_res.get("error", "Failed to resolve birthplace location coordinates.")
        )
        
    lat = geo_res.get("lat")
    lon = geo_res.get("lon")
    timezone_str = geo_res.get("timezone")
    
    # 2. Compute natal chart
    chart_res = compute_birth_chart(
        date_str=request.dob,
        time_str=request.time,
        lat=lat,
        lon=lon,
        timezone_str=timezone_str
    )
    
    if not chart_res.get("success"):
        raise HTTPException(
            status_code=400, 
            detail=chart_res.get("error", "Failed to calculate birth chart coordinates.")
        )
        
    # 3. Save to database
    save_birth_details(
        user_id=request.user_id,
        dob=request.dob,
        time=request.time,
        place=request.place,
        lat=lat,
        lon=lon,
        timezone=timezone_str
    )
    
    return {
        "success": True,
        "lat": lat,
        "lon": lon,
        "timezone": timezone_str,
        "chart": chart_res
    }

@router.get("/birth-details")
async def get_user_birth_details(user_id: str):
    """Retrieves birth profile and chart for a user."""
    details = get_birth_details(user_id)
    if not details:
        return {"success": False, "detail": "No birth profile found."}
        
    # Re-calculate chart dynamically to include all details
    chart_res = compute_birth_chart(
        date_str=details.get("dob"),
        time_str=details.get("time"),
        lat=details.get("lat"),
        lon=details.get("lon"),
        timezone_str=details.get("timezone")
    )
    
    return {
        "success": True,
        "details": details,
        "chart": chart_res
    }
