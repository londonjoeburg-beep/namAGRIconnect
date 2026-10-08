"""
Irrigation calculator — real agronomic formulas.
Reference: FAO-56 crop coefficients (approximate Namibian conditions).
"""

CROP_COEFF = {
    "maize": 5.5, "wheat": 4.5, "tomato": 6.5,
    "onion": 4.8, "potato": 5.2, "grapes": 6.0, "pasture": 7.5
}
SOIL_FACTOR = {"sandy": 1.15, "clay": 0.9, "loam": 1.0}


def calculate_water(payload: dict) -> dict:
    crop = payload.get("crop", "maize").lower()
    area = float(payload.get("area", 1.0))
    soil = payload.get("soil", "loam").lower()
    stage = float(payload.get("stage", 1.0))

    base_mm = CROP_COEFF.get(crop, 5.5) * SOIL_FACTOR.get(soil, 1.0) * stage
    daily_liters = base_mm * 10000 * area       # mm/ha → L
    daily_m3 = daily_liters / 1000

    # Drip calc (2.3 L/hr × 4 emitters/m²)
    drip_rate_l_per_hr = 2.3 * 4 * 10000 * area
    drip_hours = daily_liters / drip_rate_l_per_hr

    return {
        "crop": crop,
        "area_ha": area,
        "soil": soil,
        "stage": stage,
        "daily_liters": round(daily_liters, 0),
        "daily_m3": round(daily_m3, 1),
        "drip_hours": round(drip_hours, 1),
        "drip_pressure_bar": 1.2,
        "emitter_spacing_cm": 30,
        "note": "Adjust down 30–50% if rain >5 mm forecast in next 24h."
    }