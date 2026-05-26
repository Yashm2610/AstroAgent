import sys
import os
import asyncio

# Add backend directory to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.tools.geocode import geocode_place
from app.tools.birth_chart import compute_birth_chart
from app.tools.transits import compute_transits
from app.tools.rag_lookup import knowledge_lookup

def test_geocoding():
    print("Testing geocode_place()...")
    res = geocode_place("Delhi")
    print(f"Geocoding result: {res}")
    assert res["success"] is True, f"Geocoding failed: {res.get('error')}"
    assert abs(res["lat"] - 28.6) < 1.0, f"Expected lat near 28.6, got {res['lat']}"
    assert abs(res["lon"] - 77.2) < 1.0, f"Expected lon near 77.2, got {res['lon']}"
    assert res["timezone"] == "Asia/Kolkata", f"Expected Asia/Kolkata, got {res['timezone']}"
    print("geocode_place() test PASSED!\n")

def test_birth_chart_calculation():
    print("Testing compute_birth_chart()...")
    # Date: 1990/08/15 12:00 at Delhi
    res = compute_birth_chart(
        date_str="1990/08/15",
        time_str="12:00",
        lat=28.6139,
        lon=77.2090,
        timezone_str="Asia/Kolkata"
    )
    print(f"Sun: {res.get('sun')}, Moon: {res.get('moon')}, Ascendant: {res.get('ascendant')}")
    assert res["success"] is True, f"Birth chart failed: {res.get('error')}"
    assert res["sun"] == "Leo", f"Expected Sun in Leo, got {res['sun']}"
    assert res["moon"] == "Gemini", f"Expected Moon in Gemini, got {res['moon']}"
    assert res["ascendant"] == "Scorpio", f"Expected Ascendant in Scorpio, got {res['ascendant']}"
    
    # Check outer planets calculated
    planets = res["planets"]
    assert "uranus" in planets, "Expected Uranus in planets"
    assert "neptune" in planets, "Expected Neptune in planets"
    assert "pluto" in planets, "Expected Pluto in planets"
    print("compute_birth_chart() test PASSED!\n")

def test_transit_calculation():
    print("Testing compute_transits()...")
    # First compute a natal chart
    natal = compute_birth_chart(
        date_str="1990/08/15",
        time_str="12:00",
        lat=28.6139,
        lon=77.2090,
        timezone_str="Asia/Kolkata"
    )
    # Compute transits comparing against natal
    transits_res = compute_transits(natal)
    print(f"Transit Success: {transits_res['success']}")
    assert transits_res["success"] is True, f"Transits failed: {transits_res.get('error')}"
    assert len(transits_res["transits"]) > 0, "Expected transiting planets to be calculated"
    print(f"Found {len(transits_res['aspects'])} active transit aspects.")
    print("compute_transits() test PASSED!\n")

def test_knowledge_lookup_rag():
    print("Testing knowledge_lookup()...")
    res = knowledge_lookup("What does Saturn in 10th house mean?")
    print(f"RAG Success: {res['success']}, Num results: {len(res['results'])}")
    assert res["success"] is True, f"RAG failed: {res.get('error')}"
    assert len(res["results"]) > 0, "Expected at least one matching section"
    
    first_result = res["results"][0]
    print(f"Top match title: {first_result['title']} (Score: {first_result['score']}) from {first_result['source']}")
    assert "saturn" in first_result["source"].lower(), "Expected Saturn source notes"
    print("knowledge_lookup() test PASSED!\n")

def run_all_tests():
    print("=========================================")
    print("RUNNING ALL ASTROAGENT TOOLS TESTS")
    print("=========================================")
    test_geocoding()
    test_birth_chart_calculation()
    test_transit_calculation()
    test_knowledge_lookup_rag()
    print("=========================================")
    print("ALL TOOLS TESTS PASSED SUCCESSFULLY!")
    print("=========================================")

if __name__ == "__main__":
    run_all_tests()
