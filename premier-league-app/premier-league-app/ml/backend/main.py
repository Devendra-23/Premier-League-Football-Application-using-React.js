from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import joblib
import pandas as pd
import os
import numpy as np

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Access Fly secrets
API_KEY = os.getenv("VITE_API_KEY")
API_HOST = os.getenv("VITE_API_HOST")

# Get base directory paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, '..', 'processed', 'top6_model.pkl')
LEAGUE_TABLE_PATH = os.path.join(BASE_DIR, '..', 'processed', 'league_table.csv')
PREDICTIONS_PATH = os.path.join(BASE_DIR, '..', 'processed', 'predicted_top6_2025.csv')

# Load historical data at startup
historical_df = None
try:
    historical_df = pd.read_csv(LEAGUE_TABLE_PATH)
    historical_df["goal_diff"] = historical_df["goals_for"] - historical_df["goals_against"]
    print(f"Loaded historical data with {len(historical_df)} records")
except Exception as e:
    print(f"Failed to load historical data: {e}")
    historical_df = pd.DataFrame()

# Load model at startup
model = None
try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully")
except Exception as e:
    print(f"Failed to load model: {e}")
    model = None

class TeamStats(BaseModel):
    team: str
    points: int
    goal_diff: int
    goals_for: int
    goals_against: int
    wins: int
    draws: int
    losses: int
    season: Optional[int] = 2024  # Default to current season

@app.get("/")
def root():
    return {
        "message": "Premier League Top 6 Prediction API",
        "endpoints": {
            "/predict": "POST with team stats to get predictions",
            "/top6-predictions": "GET precomputed top 6 predictions"
        },
        "env": {
            "API_KEY_FOUND": API_KEY is not None,
            "API_HOST_FOUND": API_HOST is not None
        }
    }

@app.post("/predict")
async def predict_top6(teams: List[TeamStats]):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    if historical_df.empty:
        raise HTTPException(status_code=500, detail="Historical data not available")
    
    try:
        # Convert input to DataFrame
        input_data = [team.dict() for team in teams]
        df = pd.DataFrame(input_data)
        
        # Prepare features for prediction
        features_list = []
        for _, row in df.iterrows():
            team = row['team']
            season = row.get('season', 2024)
            
            # Get historical data for the team
            team_history = historical_df[
                (historical_df['team'] == team) & 
                (historical_df['season'] < season)
            ]
            
            # Calculate years in league
            years_in_league = team_history['season'].nunique()
            
            # Calculate points change from previous season
            points_change = 0.0
            if len(team_history) > 0:
                prev_season = team_history[team_history['season'] == (season - 1)]
                if not prev_season.empty:
                    prev_points = prev_season['points'].values[0]
                    current_points = row['points']
                    points_change = (current_points - prev_points) / prev_points if prev_points != 0 else 0.0
            
            # Create feature dictionary
            features = {
                'points_prev': row['points'],
                'goal_diff_prev': row['goal_diff'],
                'goals_for_prev': row['goals_for'],
                'goals_against_prev': row['goals_against'],
                'wins_prev': row['wins'],
                'draws_prev': row['draws'],
                'losses_prev': row['losses'],
                'points_change': points_change,
                'years_in_league': years_in_league
            }
            features_list.append(features)
        
        # Create prediction DataFrame
        feature_df = pd.DataFrame(features_list)
        
        # Ensure correct feature order
        expected_features = [
            'points_prev', 'goal_diff_prev', 'goals_for_prev', 'goals_against_prev',
            'wins_prev', 'draws_prev', 'losses_prev', 'points_change', 'years_in_league'
        ]
        feature_df = feature_df[expected_features]
        
        # Make predictions
        probabilities = model.predict_proba(feature_df)[:, 1]
        predictions = (probabilities >= 0.5).astype(int)
        
        # Format results
        results = []
        for i, team_data in enumerate(input_data):
            results.append({
                "team": team_data['team'],
                "top6_probability": float(probabilities[i]),
                "top6_prediction": int(predictions[i]),
                "features": feature_df.iloc[i].to_dict()
            })
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/top6-predictions")
def get_top6_predictions():
    try:
        if not os.path.exists(PREDICTIONS_PATH):
            raise FileNotFoundError("Prediction file not found")
            
        df = pd.read_csv(PREDICTIONS_PATH)
        
        # Rename columns for consistency
        df = df.rename(columns={
            'top_6_prob_2025': 'probability',
            'points': 'current_points',
            'goal_diff': 'current_goal_diff'
        })
        
        # Select and sort top 6 teams
        top6_df = df.sort_values('probability', ascending=False).head(6)
        return top6_df.to_dict(orient='records')
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Prediction file not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Required for Fly.io - listen on port 8080
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080)
