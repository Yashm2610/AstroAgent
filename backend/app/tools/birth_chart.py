import logging
from datetime import datetime
import zoneinfo
from flatlib.datetime import Datetime
from flatlib.geopos import GeoPos
from flatlib.chart import Chart
from flatlib import const

logger = logging.getLogger(__name__)

def get_timezone_offset_string(date_str: str, time_str: str, tz_name: str) -> str:
    """
    Given a local date (YYYY/MM/DD) and time (HH:MM) and timezone name (e.g. Asia/Kolkata),
    returns the offset string formatted for flatlib (e.g. "+05:30", "-04:00").
    """
    try:
        dt_str = f"{date_str} {time_str}"
        local_dt = datetime.strptime(dt_str, "%Y/%m/%d %H:%M")
        tz = zoneinfo.ZoneInfo(tz_name)
        localized_dt = local_dt.replace(tzinfo=tz)
        offset_seconds = localized_dt.utcoffset().total_seconds()
        
        hours = int(abs(offset_seconds) // 3600)
        minutes = int((abs(offset_seconds) % 3600) // 60)
        sign = "+" if offset_seconds >= 0 else "-"
        return f"{sign}{hours:02d}:{minutes:02d}"
    except Exception as e:
        logger.error(f"Error computing timezone offset string: {str(e)}")
        return "+00:00"

def compute_birth_chart(date_str: str, time_str: str, lat: float, lon: float, timezone_str: str) -> dict:
    """
    Computes a full birth chart using flatlib, returning signs, degrees, and houses.
    
    Args:
        date_str (str): Date formatted as "YYYY/MM/DD" or "YYYY-MM-DD"
        time_str (str): Time formatted as "HH:MM"
        lat (float): Latitude
        lon (float): Longitude
        timezone_str (str): IANA timezone string (e.g. "Asia/Kolkata")
        
    Returns:
        dict: Calculation results
    """
    try:
        # Standardize date format to YYYY/MM/DD
        date_str_formatted = date_str.replace("-", "/")
        
        # Calculate timezone offset
        offset_str = get_timezone_offset_string(date_str_formatted, time_str, timezone_str)
        
        # Initialize flatlib Datetime and GeoPos
        date = Datetime(date_str_formatted, time_str, offset_str)
        pos = GeoPos(lat, lon)
        
        # Compute chart including outer planets (using LIST_OBJECTS) and Placidus houses
        chart = Chart(date, pos, hsys=const.HOUSES_PLACIDUS, IDs=const.LIST_OBJECTS)
        
        # Helper to get the house number of an object
        def get_house_of_object(obj):
            for i in range(1, 13):
                h = chart.getHouse(f"House{i}")
                if h and h.hasObject(obj):
                    return i
            return None

        # Extract planets & nodes positions
        planets = {}
        for obj in chart.objects:
            # Skip non-planetary elements like Syzygy if present
            if obj.id == 'Syzygy':
                continue
                
            # format keys as snake_case (e.g., 'north_node', 'sun')
            key = obj.id.lower().replace(" ", "_")
            
            planets[key] = {
                "name": obj.id,
                "sign": obj.sign,
                "degree": round(obj.signlon, 2),
                "longitude": round(obj.lon, 2),
                "house": get_house_of_object(obj),
                "is_retrograde": obj.isRetrograde() if hasattr(obj, "isRetrograde") else False
            }
            
        # Extract houses
        houses = {}
        for i in range(1, 13):
            h = chart.getHouse(f"House{i}")
            if h:
                houses[f"house_{i}"] = {
                    "sign": h.sign,
                    "degree": round(h.signlon, 2),
                    "longitude": round(h.lon, 2),
                    "size": round(h.size, 2)
                }
                
        # Extract angles
        angles = {}
        for angle_obj in chart.angles:
            angles[angle_obj.id.lower()] = {
                "name": angle_obj.id,
                "sign": angle_obj.sign,
                "degree": round(angle_obj.signlon, 2),
                "longitude": round(angle_obj.lon, 2)
            }
            
        # Extract short summary for rapid UI rendering
        asc = angles.get("asc", {}).get("sign", "Unknown")
        sun = planets.get("sun", {}).get("sign", "Unknown")
        moon = planets.get("moon", {}).get("sign", "Unknown")
        
        return {
            "success": True,
            "ascendant": asc,
            "sun": sun,
            "moon": moon,
            "planets": planets,
            "houses": houses,
            "angles": angles,
            "raw_details": {
                "date": date_str,
                "time": time_str,
                "latitude": lat,
                "longitude": lon,
                "timezone": timezone_str,
                "offset": offset_str
            },
            "error": None
        }
    except Exception as e:
        logger.error(f"Error computing birth chart: {str(e)}", exc_info=True)
        return {
            "success": False,
            "error": f"Astrological calculation failed: {str(e)}"
        }
