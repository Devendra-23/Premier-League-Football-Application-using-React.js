from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import joblib
import pandas as pd
import os
import numpy as np
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# ✅ Define BASE_DIR FIRST
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ✅ Path to React build
frontend_path = os.path.join(BASE_DIR, '..', 'frontend_dist')

# ✅ Initialize app
app = FastAPI()

# ✅ CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Paths to model and data
MODEL_PATH = os.path.join(BASE_DIR, '..', 'processed', 'top6_model.pkl')
LEAGUE_TABLE_PATH = os.path.join(BASE_DIR, '..', 'processed', 'league_table.csv')
PREDICTIONS_PATH = os.path.join(BASE_DIR, '..', 'processed', 'predicted_top6_2025.csv')

# ✅ Load historical data
historical_df = None
try:
    historical_df = pd.read_csv(LEAGUE_TABLE_PATH)
    historical_df["goal_diff"] = historical_df["goals_for"] - historical_df["goals_against"]
    print(f"Loaded historical data with {len(historical_df)} records")
except Exception as e:
    print(f"Failed to load historical data: {e}")
    historical_df = pd.DataFrame()

# ✅ Load model
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
    season: Optional[int] = 2024


@app.get("/")
def root():
    return {
        "message": "Premier League Top 6 Prediction API",
        "endpoints": {
            "/predict": "POST with team stats to get predictions",
            "/top6-predictions": "GET precomputed top 6 predictions"
        }
    }

@app.post("/predict")
async def predict_top6(teams: List[TeamStats]):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    if historical_df.empty:
        raise HTTPException(status_code=500, detail="Historical data not available")

    try:
        input_data = [team.dict() for team in teams]
        df = pd.DataFrame(input_data)

        features_list = []
        for _, row in df.iterrows():
            team = row['team']
            season = row.get('season', 2024)

            team_history = historical_df[
                (historical_df['team'] == team) &
                (historical_df['season'] < season)
            ]

            years_in_league = team_history['season'].nunique()

            points_change = 0.0
            if len(team_history) > 0:
                prev_season = team_history[team_history['season'] == (season - 1)]
                if not prev_season.empty:
                    prev_points = prev_season['points'].values[0]
                    current_points = row['points']
                    points_change = (current_points - prev_points) / prev_points if prev_points != 0 else 0.0

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

        feature_df = pd.DataFrame(features_list)

        expected_features = [
            'points_prev', 'goal_diff_prev', 'goals_for_prev', 'goals_against_prev',
            'wins_prev', 'draws_prev', 'losses_prev', 'points_change', 'years_in_league'
        ]
        feature_df = feature_df[expected_features]

        probabilities = model.predict_proba(feature_df)[:, 1]
        predictions = (probabilities >= 0.5).astype(int)

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

        predictions_df = pd.read_csv(PREDICTIONS_PATH)
        predicted_teams = predictions_df['team'].tolist()

        if historical_df.empty:
            raise HTTPException(status_code=500, detail="Historical data not available")

        full_stats = historical_df[
            (historical_df['season'] == 2024) &
            (historical_df['team'].isin(predicted_teams))
        ]

        if full_stats.empty:
            print("Warning: No historical stats found for predicted teams")
            predictions_df = predictions_df.rename(columns={
                'top_6_prob_2025': 'probability'
            })
            top6_df = predictions_df.sort_values('probability', ascending=False).head(6)
            return top6_df.to_dict(orient='records')

        full_stats = full_stats[['team', 'points', 'goal_diff', 'goals_for', 'goals_against', 'wins', 'draws', 'losses']]

        merged_df = pd.merge(predictions_df, full_stats, on='team', how='left')
        merged_df = merged_df.rename(columns={
            'top_6_prob_2025': 'probability',
            'points_y': 'points',
            'goal_diff_y': 'goal_diff',
            'goals_for_y': 'goals_for',
            'goals_against_y': 'goals_against',
            'wins_y': 'wins',
            'draws_y': 'draws',
            'losses_y': 'losses'
        })

        top6_df = merged_df.sort_values('probability', ascending=False).head(6)
        return top6_df.to_dict(orient='records')

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Prediction file not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ MOUNT FRONTEND LAST
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")

@app.get("/{full_path:path}")
async def serve_react_app():
    index_file = os.path.join(frontend_path, "index.html")
    return FileResponse(index_file)
