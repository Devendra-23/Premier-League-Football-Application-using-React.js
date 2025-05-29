import json
import os
import pandas as pd

def load_standings_data(data_dir="data", start_year=2015, end_year=2024):
    records = []
    for season in range(start_year, end_year + 1):
        with open(f"{data_dir}/standings_{season}.json", "r") as f:
            season_data = json.load(f)
            for team in season_data['response'][0]['league']['standings'][0]:
                records.append({
                    "season": season,
                    "team": team["team"]["name"],
                    "rank": team["rank"],
                    "points": team["points"],
                    "goals_for": team["all"]["goals"]["for"],
                    "goals_against": team["all"]["goals"]["against"],
                    "wins": team["all"]["win"],
                    "draws": team["all"]["draw"],
                    "losses": team["all"]["lose"]
                })
    df = pd.DataFrame(records)

    # ✅ Add goal difference column
    df['goal_diff'] = df['goals_for'] - df['goals_against']

    return df

if __name__ == "__main__":
    df = load_standings_data()
    print(df.head())

    # ✅ Ensure the 'processed' folder exists
    os.makedirs("processed", exist_ok=True)

    # ✅ Save updated CSV
    df.to_csv("processed/league_table.csv", index=False)
