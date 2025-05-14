import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function PlayerStats() {
  const [topScorers, setTopScorers] = useState([]);
  const [topAssists, setTopAssists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopStats = async () => {
      try {
        setLoading(true);

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

        console.log("Top Scorers Sample:", scorersRes.data.response[0]);
        console.log("Top Assisters Sample:", assistsRes.data.response[0]);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Top Scorers */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-4 text-fuchsia-900">Top Scorers</h3>
        <div className="space-y-3">
          {topScorers.map((playerObj, idx) => (
            <PlayerRow
              key={playerObj.player.id}
              rank={idx + 1}
              player={playerObj.player}
              team={playerObj.statistics[0].team}
              value={playerObj.statistics[0].goals.total}
              label="goals"
            />
          ))}
        </div>
      </div>

      {/* Top Assists */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-4 text-fuchsia-900">Top Assists</h3>
        <div className="space-y-3">
          {topAssists.map((playerObj, idx) => (
            <PlayerRow
              key={playerObj.player.id}
              rank={idx + 1}
              player={playerObj.player}
              team={playerObj.statistics[0].team}
              value={playerObj.statistics[0].goals.assists}
              label="assists"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const PlayerRow = ({ rank, player, team, value, label }) => (
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
          <img src={team.logo} className="w-4 h-4" alt={team.name} />
          {team.name}
        </p>
      </div>
    </div>
    <span className="font-bold text-emerald-600">
      {value !== null ? value : 0}
    </span>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <div className="w-8 h-8 border-4 border-t-4 border-gray-300 border-t-fuchsia-500 rounded-full animate-spin"></div>
  </div>
);
