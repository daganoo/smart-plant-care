from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import time
from functools import wraps

from .models import PredictionRequest, PredictionResponse, WeatherData
from .services import PlantCareService

# Configuration CORS
origins = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # React dev server
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

# Instance du service
plant_service = PlantCareService()

# Décorateur pour timing des requêtes
def timer_decorator(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        result = await func(*args, **kwargs)
        end_time = time.time()
        print(f"⏱️  Temps d'exécution: {(end_time - start_time)*1000:.2f}ms")
        return result
    return wrapper

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestion du cycle de vie de l'application."""
    print("🌱 Smart Plant Care API démarrée!")
    print(f"📊 Seuil d'humidité configuré: {plant_service.humidity_threshold}%")
    yield
    print("🛑 Arrêt de l'API...")

app = FastAPI(
    title="Smart Plant Care API",
    description="API intelligente pour la gestion de l'arrosage des plantes",
    version="1.0.0",
    lifespan=lifespan
)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Endpoint racine."""
    return {
        "message": "🌱 Smart Plant Care API",
        "version": "1.0.0",
        "status": "Opérationnelle",
        "endpoints": {
            "GET /": "Info API",
            "POST /predict": "Prédiction d'arrosage",
            "GET /health": "Vérification santé"
        }
    }

@app.get("/health")
async def health_check():
    """Vérification de la santé de l'API."""
    return {
        "status": "healthy",
        "service": "plant_care",
        "threshold": plant_service.humidity_threshold
    }

@app.post("/predict", response_model=PredictionResponse)
@timer_decorator
async def predict_watering(request: PredictionRequest):
    """
    Prédit si la Plante nécessite un arrosage.
    
    Args:
        request: Données de prédiction (humidité + météo optionnelle)
        
    Returns:
        Décision d'arrosage avec confiance et explication
    """
    try:
        # Créer objet météo si données fournies
        weather = None
        if request.temperature and request.weather_condition:
            weather = WeatherData(
                temperature=request.temperature,
                humidity=65,  # Valeur par défaut
                condition=request.weather_condition,
                rainfall_probability=0.0
            )
        
        result = plant_service.predict_watering(
            humidity=request.humidity,
            weather=weather
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/schedule/{humidity}")
async def get_schedule(humidity: float):
    """Obtient un planning d'arrosage recommandé."""
    schedule = plant_service.get_watering_schedule(humidity)
    return {
        "current_humidity": humidity,
        "recommendation": schedule
    }