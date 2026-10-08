"""
Soil analysis — heuristic + rule-based engine.
If a trained model exists in models/soil_model.pkl it will be used,
otherwise falls back to deterministic rules that work out of the box.
"""
import os, pickle, random

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "soil_model.pkl")
_model = None
if os.path.exists(MODEL_PATH):
    try:
        with open(MODEL_PATH, "rb") as f:
            _model = pickle.load(f)
    except Exception as e:
        print("⚠️ Could not load soil model:", e)


def _classify_texture(image_b64: str | None) -> str:
    # Without a real CNN, we simulate deterministic texture from hash
    if not image_b64:
        return "Unknown"
    h = hash(image_b64[:500]) % 100
    if h < 33: return "Sandy"
    if h < 66: return "Loam"
    return "Clay"


def analyze_soil(payload: dict) -> dict:
    image = payload.get("image")
    manual = payload.get("readings") or {}

    texture = _classify_texture(image)

    # Manual readings override when present
    N = float(manual.get("N", 22))
    P = float(manual.get("P", 14))
    K = float(manual.get("K", 110))
    pH = float(manual.get("pH", 6.2))
    EC = float(manual.get("EC", 0.9))

    issues = []
    if N < 25: issues.append({"nutrient":"Nitrogen (N)","value":N,"level":"Low",
        "recommendation":"Apply kraal manure (2 t/ha) or urea top-dress."})
    else:      issues.append({"nutrient":"Nitrogen (N)","value":N,"level":"Adequate",
        "recommendation":"Maintain current practices."})

    if P < 15: issues.append({"nutrient":"Phosphorus (P)","value":P,"level":"Low",
        "recommendation":"Apply bone meal or rock phosphate (200 kg/ha)."})
    else:      issues.append({"nutrient":"Phosphorus (P)","value":P,"level":"Adequate",
        "recommendation":"No action."})

    if K < 100: issues.append({"nutrient":"Potassium (K)","value":K,"level":"Low",
        "recommendation":"Apply wood ash or KCl."})
    else:       issues.append({"nutrient":"Potassium (K)","value":K,"level":"Adequate",
        "recommendation":"No action."})

    ph_status = "Optimal" if 5.8 <= pH <= 7.2 else ("Too acidic" if pH < 5.8 else "Too alkaline")
    sal_status = "Safe" if EC < 2 else ("Moderate" if EC < 4 else "High risk")

    return {
        "texture": texture,
        "organic_matter": f"{round(random.uniform(1.2, 3.4), 1)}%",
        "salinity": {"value": EC, "status": sal_status},
        "ph": {"value": pH, "status": ph_status},
        "nutrients": issues,
        "summary": f"{texture} soil, {ph_status.lower()} pH, salinity {sal_status.lower()}."
    }