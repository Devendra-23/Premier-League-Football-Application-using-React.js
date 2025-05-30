from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import joblib
import pandas as pd
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or use ["http://localhost:3000"] to be stricter
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, '..', 'processed', 'top6_model.pkl')
CSV_PATH = os.path.join(BASE_DIR, '..', 'processed', 'league_table.csv')

try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load model: {e}")

class TeamStats(BaseModel):
    points: int
    goal_diff: int
    goals_for: int
    goals_against: int
    wins: int
    draws: int
    losses: int
    team: str = None

@app.get("/")
def root():
    return {"message": "FastAPI is working!"}

@app.post("/predict")
async def predict_top6(teams: List[TeamStats]):
    try:
        df = pd.DataFrame([team.dict() for team in teams])
        features = ["points", "goal_diff", "goals_for", "goals_against", "wins", "draws", "losses"]
        X = df[features]
        preds = model.predict(X)
        df['predicted_top6'] = preds
        return df.to_dict(orient='records')
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/top6-predictions")
def get_top6_predictions():
    try:
        df = pd.read_csv(CSV_PATH)
        features = ["points", "goal_diff", "goals_for", "goals_against", "wins", "draws", "losses"]
        
        # Verify columns exist
        missing_cols = [col for col in features if col not in df.columns]
        if missing_cols:
            raise HTTPException(status_code=500, detail=f"Missing columns in CSV: {missing_cols}")
        
        X = df[features]
        preds = model.predict(X)
        df['predicted_top6'] = preds

        top6_df = df[df['predicted_top6'] == 1]
        top6_df = top6_df.sort_values(by=['points', 'goal_diff'], ascending=[False, False])

        return top6_df.to_dict(orient='records')
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="League table CSV file not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
