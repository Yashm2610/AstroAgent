import logging
from datetime import datetime, timezone
import zoneinfo
from flatlib.datetime import Datetime
from flatlib.geopos import GeoPos
from flatlib.chart import Chart
from flatlib import const

logger = logging.getLogger(__name__)

def get_aspect(lon1: float, lon2: float) -> str:
    """
    Checks if there is a major aspect between two longitudes within standard orbs.
    Returns the aspect name ("conjunction", "sextile", "square", "trine", "opposition") or None.
    """
    diff = abs(lon1 - lon2) % 360
    if diff > 180:
        diff = 360 - diff
        
    aspects = {
        "conjunction": (0.0, 5.0),  # angle, orb
        "sextile": (60.0, 4.0),
        "square": (90.0, 5.0),
        "trine": (120.0, 5.0),
        "opposition": (180.0, 5.0)
    }
    
    for name, (angle, orb) in aspects.items():
        if abs(diff - angle) <= orb:
            return name
    return None

def compute_transits(natal_chart_data: dict, current_lat: float = 0.0, current_lon: float = 0.0) -> dict:
    """
    Computes current planetary transits and compares them with the user's natal chart positions.
    
    Args:
        natal_chart_data (dict): The resolved natal chart dictionary containing 'planets' and 'raw_details'.
        current_lat (float): Current latitude of the user (falls back to birth lat if 0.0).
        current_lon (float): Current longitude of the user (falls back to birth lon if 0.0).
        
    Returns:
        dict: Transit analysis including transiting planetary positions, transited natal houses, and aspects.
    """
    try:
        # Fallback to natal coordinates if current coordinates are not provided
        raw_details = natal_chart_data.get("raw_details", {})
        lat = current_lat or raw_details.get("latitude", 0.0)
        lon = current_lon or raw_details.get("longitude", 0.0)
        
        # Get current UTC time
        now = datetime.now(timezone.utc)
        date_str = now.strftime("%Y/%m/%d")
        time_str = now.strftime("%H:%M")
        
        # Initialize Datetime for flatlib (UTC offset +00:00)
        date = Datetime(date_str, time_str, "+00:00")
        pos = GeoPos(lat, lon)
        
        # Compute transit chart using outer planets
        transit_chart = Chart(date, pos, hsys=const.HOUSES_PLACIDUS, IDs=const.LIST_OBJECTS)
        
        # Re-create natal chart object using the original details to check house containment
        natal_date_str = raw_details.get("date", "").replace("-", "/")
        natal_time_str = raw_details.get("time", "")
        natal_offset_str = raw_details.get("offset", "+00:00")
        natal_lat = raw_details.get("latitude", 0.0)
        natal_lon = raw_details.get("longitude", 0.0)
        
        natal_date = Datetime(natal_date_str, natal_time_str, natal_offset_str)
        natal_pos = GeoPos(natal_lat, natal_lon)
        natal_chart = Chart(natal_date, natal_pos, hsys=const.HOUSES_PLACIDUS, IDs=const.LIST_OBJECTS)
        
        # Helper to find which natal house a transiting longitude falls into
        def get_natal_house(transit_lon: float) -> int:
            for i in range(1, 13):
                h = natal_chart.getHouse(f"House{i}")
                if h and h.inHouse(transit_lon):
                    return i
            return None

        # Build transiting planets dictionary
        transits = {}
        aspects_list = []
        
        for obj in transit_chart.objects:
            if obj.id == 'Syzygy':
                continue
                
            key = obj.id.lower().replace(" ", "_")
            transit_lon = obj.lon
            natal_house = get_natal_house(transit_lon)
            
            transits[key] = {
                "name": obj.id,
                "sign": obj.sign,
                "degree": round(obj.signlon, 2),
                "longitude": round(transit_lon, 2),
                "transiting_house": natal_house
            }
            
            # Compare transiting planet against all natal planets for aspects
            for natal_key, natal_val in natal_chart_data.get("planets", {}).items():
                natal_lon = natal_val.get("longitude")
                if natal_lon is not None:
                    aspect_name = get_aspect(transit_lon, natal_lon)
                    if aspect_name:
                        aspects_list.append({
                            "transiting_planet": obj.id,
                            "aspect": aspect_name,
                            "natal_planet": natal_val.get("name"),
                            "description": f"Transiting {obj.id} in {aspect_name} with natal {natal_val.get('name')}"
                        })
                        
        return {
            "success": True,
            "transits": transits,
            "aspects": aspects_list,
            "transit_time": now.isoformat(),
            "error": None
        }
    except Exception as e:
        logger.error(f"Error computing transits: {str(e)}", exc_info=True)
        return {
            "success": False,
            "error": f"Transit calculation failed: {str(e)}"
        }
