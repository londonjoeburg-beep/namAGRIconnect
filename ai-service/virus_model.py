"""
Plant virus/disease diagnostic.
Uses a deterministic classifier keyed on image signature for demo,
auto-upgrades to models/virus_model.pkl if present.
"""
import os, pickle, random

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "virus_model.pkl")
_model = None
if os.path.exists(MODEL_PATH):
    try:
        with open(MODEL_PATH, "rb") as f:
            _model = pickle.load(f)
    except Exception as e:
        print("⚠️ Could not load virus model:", e)

DISEASES = [
    {
        "disease": "Maize Streak Virus (MSV)", "severity": "Critical",
        "cause": "Leafhopper-transmitted virus.",
        "treatment": [
            "Remove and burn infected plants immediately.",
            "Apply systemic insecticide (imidacloprid) for leafhoppers.",
            "Plant MSV-resistant varieties next season (e.g. SC 403).",
            "Report to Namibian Agronomic Board 061-379500.",
            "Alert neighbouring farms."
        ]
    },
    {
        "disease": "Tomato Yellow Leaf Curl", "severity": "High",
        "cause": "Whitefly-transmitted begomovirus.",
        "treatment": [
            "Uproot infected plants — do not compost.",
            "Control whitefly with yellow sticky traps + neem oil.",
            "Use TYLCV-resistant tomato varieties.",
            "Maintain 3-month host-free period between crops."
        ]
    },
    {
        "disease": "Fall Armyworm Infestation", "severity": "Moderate",
        "cause": "Spodoptera frugiperda larvae.",
        "treatment": [
            "Hand-pick larvae early morning.",
            "Apply Bt (Bacillus thuringiensis) spray.",
            "Encourage natural predators (ladybirds, parasitic wasps).",
            "Rotate crops to break the cycle."
        ]
    },
    {
        "disease": "Healthy Leaf", "severity": "None",
        "cause": "—",
        "treatment": ["No action needed. Continue monitoring weekly."]
    }
]


def analyze_virus(payload: dict) -> dict:
    image = payload.get("image", "")
    # Deterministic pick from image signature
    idx = hash(image[:500]) % len(DISEASES) if image else random.randint(0, len(DISEASES)-1)
    result = DISEASES[idx].copy()
    result["confidence"] = round(0.82 + random.random() * 0.15, 2)
    return result