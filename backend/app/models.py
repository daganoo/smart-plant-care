from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Schéma pour la prédiction d'arrosage
class PredictionRequest(BaseModel):
    humidity: float  # Humidité du sol (0-100%)
    temperature: Optional[float] = 22.0  # Température en °C
    weather_condition: Optional[str] = "sunny"  # sunny, cloudy, rainy

class PredictionResponse(BaseModel):
    should_water: bool
    message: str
    confidence: float
    reason: str
    timestamp: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "should_water": True,
                "message": "Arroser la plante 💧",
                "confidence": 0.92,
                "reason": "Humidité sous le seuil critique (40%)",
                "timestamp": "2024-01-15T10:30:00"
            }
        }

# Schéma pour les données météo
class WeatherData(BaseModel):
    temperature: float
    humidity: float
    condition: str
    rainfall_probability: float