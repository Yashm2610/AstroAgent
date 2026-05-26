import logging
from geopy.geocoders import Nominatim
from timezonefinder import TimezoneFinder

logger = logging.getLogger(__name__)

def geocode_place(place: str) -> dict:
    """
    Geocodes a place name to obtain latitude, longitude, and IANA timezone name.
    
    Args:
        place (str): The city or location name (e.g., "Delhi", "New York").
        
    Returns:
        dict: {
            "success": bool,
            "lat": float or None,
            "lon": float or None,
            "timezone": str or None,
            "error": str or None
        }
    """
    try:
        # Define user_agent to comply with Nominatim usage policy
        geolocator = Nominatim(user_agent="astroagent_client_application_v1")
        location = geolocator.geocode(place, timeout=10)
        
        if not location:
            return {
                "success": False,
                "lat": None,
                "lon": None,
                "timezone": None,
                "error": f"Could not resolve place name '{place}'."
            }
            
        lat = location.latitude
        lon = location.longitude
        
        # Determine the IANA timezone using timezonefinder
        tf = TimezoneFinder()
        timezone_str = tf.timezone_at(lng=lon, lat=lat)
        
        if not timezone_str:
            timezone_str = "UTC" # Fallback to UTC if timezone cannot be determined
            
        return {
            "success": True,
            "lat": lat,
            "lon": lon,
            "timezone": timezone_str,
            "error": None
        }
    except Exception as e:
        logger.error(f"Geocoding failed for '{place}': {str(e)}")
        return {
            "success": False,
            "lat": None,
            "lon": None,
            "timezone": None,
            "error": f"Geocoding service unavailable: {str(e)}"
        }
