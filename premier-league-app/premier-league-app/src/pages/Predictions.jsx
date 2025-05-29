import { useEffect, useState } from "react";

export default function Predictions() {
  const [top6Teams, setTop6Teams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTop6() {
      try {
        const res = await fetch("http://127.0.0.1:8000/top6-predictions");
        if (!res.ok) throw new Error("Failed to fetch predictions");
        const data = await res.json();
        setTop6Teams(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTop6();
  }, []);

  if (loading) return <p>Loading predictions...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Top 6 Predicted Teams
      </h1>

      <div className="grid gap-4 md:grid-cols-2">
        {top6Teams.map((team) => (
          <div
            key={team.team}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col"
          >
            <h2 className="text-xl font-semibold">{team.team}</h2>
            <p>Points: {team.points}</p>
            <p>Goal Difference: {team.goal_diff}</p>
            <p>Goals For: {team.goals_for}</p>
            <p>Goals Against: {team.goals_against}</p>
            <p>Wins: {team.wins}</p>
            <p>Draws: {team.draws}</p>
            <p>Losses: {team.losses}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
