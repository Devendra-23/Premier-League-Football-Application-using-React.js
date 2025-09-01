import requests
import json
from dotenv import load_dotenv
import os

load_dotenv()

# Load .env from the parent directory
env_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv(dotenv_path=env_path)

# Get the key from environment
api_key = os.getenv("VITE_API_KEY")

if not api_key:
    raise ValueError("VITE_API_KEY not found in .env file!")

headers = {
    "X-RapidAPI-Key": api_key,
    "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com"
}

def fetch_standings(season):
    url = "https://api-football-v1.p.rapidapi.com/v3/standings"
    params = {"league": 39, "season": season}
    response = requests.get(url, headers=headers, params=params)
    data = response.json()
    
    os.makedirs("ml/data", exist_ok=True)
    with open(f"ml/data/standings_{season}.json", "w") as f:
        json.dump(data, f, indent=2)
    print(f"✅ Saved standings for {season}")

if __name__ == "__main__":
    for season in range(2015, 2025):
        fetch_standings(season)
