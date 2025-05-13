// PlayerStats.jsx
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function PlayerStats() {
  const [topScorers, setTopScorers] = useState([]);
  const [topAssists, setTopAssists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scorersRes, assistsRes] = await Promise.all([
          api.get("/players/topscorers", {
            params: { league: 39, season: 2024 },
          }),
          api.get("/players/topassists", {
            params: { league: 39, season: 2024 },
          }),
        ]);

        setTopScorers(scorersRes.data.response);
        setTopAssists(assistsRes.data.response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Top Scorers */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-4 text-fuchsia-900">Top Scorers</h3>
        <div className="space-y-3">
          {topScorers.slice(0, 10).map((player, idx) => (
            <PlayerRow
              key={player.player.id}
              rank={idx + 1}
              player={player.player}
              stats={player.statistics[0]}
              type="goals"
            />
          ))}
        </div>
      </div>

      {/* Top Assists */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-4 text-fuchsia-900">Top Assists</h3>
        <div className="space-y-3">
          {topAssists.slice(0, 10).map((player, idx) => (
            <PlayerRow
              key={player.player.id}
              rank={idx + 1}
              player={player.player}
              stats={player.statistics[0]}
              type="assists"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const PlayerRow = ({ rank, player, stats, type }) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
    <div className="flex items-center gap-3">
      <span className="text-gray-500 w-6">{rank}.</span>
      <img
        src={player.photo}
        alt={player.name}
        className="w-8 h-8 rounded-full object-cover"
      />
      <div>
        <p className="font-medium text-fuchsia-900">{player.name}</p>
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <img
            src={stats.team.logo}
            className="w-4 h-4"
            alt={stats.team.name}
          />
          {stats.team.name}
        </p>
      </div>
    </div>
    <span className="font-bold text-emerald-600">
      {type === "goals" ? stats.goals.total : stats.goals.assists}
    </span>
  </div>
);

// Simple loading spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="w-8 h-8 border-4 border-t-4 border-gray-300 border-t-fuchsia-500 rounded-full animate-spin"></div>
  </div>
);
