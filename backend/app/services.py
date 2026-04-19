import numpy as np
from datetime import datetime
from .models import PredictionResponse, WeatherData

class PlantCareService:
    """Service de prédiction pour l'arrosage des plantes."""
    
    def __init__(self):
        # Seuil d'humidité critique (peut être ajusté)
        self.humidity_threshold = 40.0
    
    def predict_watering(self, humidity: float, weather: WeatherData = None) -> PredictionResponse:
        """
        Prédit si la plante a besoin d'eau basé sur:
        - Humidité actuelle du sol
        - Conditions météorologiques
        - Seuil critique configuré
        
        Args:
            humidity: Pourcentage d'humidité du sol (0-100)
            weather: Données météorologiques optionnelles
            
        Returns:
            PredictionResponse avec décision et explication
        """
        
        timestamp = datetime.now()
        
        # Logique de prédiction simple mais robuste
        should_water = humidity < self.humidity_threshold
        
        # Ajustement selon la météo si disponible
        if weather:
            if weather.rainfall_probability > 0.7:
                # Forte probabilité de pluie - réduire l'arrosage
                should_water = False
            elif weather.temperature > 30 and humidity < 50:
                # Chaleur + humidité modérée = arroser
                should_water = True
        
        # Calcul de confiance basé sur la clarté de la décision
        if humidity < 30:
            confidence = 0.95  # Très sec - décision claire
            reason = f"Humidité très basse ({humidity:.1f}%) - Arrosage urgent"
        elif humidity < 40:
            confidence = 0.92
            reason = f"Humidité sous le seuil critique ({self.humidity_threshold}%)"
        else:
            confidence = 0.88
            reason = "Humidité adéquate pour la plante"
        
        if should_water:
            message = "💧 Arroser la plante"
        else:
            message = "❌ Pas besoin d'arrosage"
        
        return PredictionResponse(
            should_water=should_water,
            message=message,
            confidence=confidence,
            reason=reason,
            timestamp=timestamp
        )
    
    def get_watering_schedule(self, current_humidity: float) -> dict:
        """Génère un planning d'arrosage recommandé."""
        if current_humidity < 30:
            return {
                "frequency": "Quotidien",
                "duration": "5-10 minutes",
                "best_time": "Matin (6h-8h)"
            }
        elif current_humidity < 50:
            return {
                "frequency": "Tous les 2 jours",
                "duration": "10-15 minutes",
                "best_time": "Soir (18h-20h)"
            }
        else:
            return {
                "frequency": "Tous les 3-4 jours",
                "duration": "15-20 minutes",
                "best_time": "Selon besoin"
            }