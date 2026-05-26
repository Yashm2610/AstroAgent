import logging
from app.database.models import get_db_connection

logger = logging.getLogger(__name__)

def ensure_user(user_id: str):
    """Ensures a user exists in the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT OR IGNORE INTO users (id) VALUES (?)", (user_id,))
        conn.commit()
    except Exception as e:
        logger.error(f"Error ensuring user {user_id}: {str(e)}")
    finally:
        conn.close()

def save_birth_details(user_id: str, dob: str, time: str, place: str, lat: float, lon: float, timezone: str):
    """Saves or updates birth details for a user."""
    ensure_user(user_id)
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT OR REPLACE INTO birth_details (user_id, dob, time, place, lat, lon, timezone)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (user_id, dob, time, place, lat, lon, timezone))
        conn.commit()
        logger.info(f"Saved birth details for user {user_id}")
    except Exception as e:
        logger.error(f"Error saving birth details for {user_id}: {str(e)}")
    finally:
        conn.close()

def get_birth_details(user_id: str) -> dict:
    """Gets the birth details for a user."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT dob, time, place, lat, lon, timezone 
            FROM birth_details WHERE user_id = ?
        """, (user_id,))
        row = cursor.fetchone()
        if row:
            return {
                "dob": row["dob"],
                "time": row["time"],
                "place": row["place"],
                "lat": row["lat"],
                "lon": row["lon"],
                "timezone": row["timezone"]
            }
        return None
    except Exception as e:
        logger.error(f"Error reading birth details for {user_id}: {str(e)}")
        return None
    finally:
        conn.close()

def save_chat_message(user_id: str, role: str, content: str):
    """Saves a message in the chat history."""
    ensure_user(user_id)
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO chats (user_id, role, content)
            VALUES (?, ?, ?)
        """, (user_id, role, content))
        conn.commit()
    except Exception as e:
        logger.error(f"Error saving chat message for {user_id}: {str(e)}")
    finally:
        conn.close()

def get_chat_history(user_id: str) -> list:
    """Gets the chat history for a user as list of dicts."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT role, content 
            FROM chats 
            WHERE user_id = ? 
            ORDER BY timestamp ASC
        """, (user_id,))
        rows = cursor.fetchall()
        return [{"role": row["role"], "content": row["content"]} for row in rows]
    except Exception as e:
        logger.error(f"Error reading chat history for {user_id}: {str(e)}")
        return []
    finally:
        conn.close()

def clear_chat_history(user_id: str):
    """Deletes all chats for a user."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM chats WHERE user_id = ?", (user_id,))
        conn.commit()
    except Exception as e:
        logger.error(f"Error clearing chat history for {user_id}: {str(e)}")
    finally:
        conn.close()
