import { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const PREMIER_LEAGUE_COLORS = {
  primary: "#00ff85",
  secondary: "#38003c",
  accent1: "#04f5ff",
  accent2: "#e90052",
};

export default function PlayerStats() {
  const [topScorers, setTopScorers] = useState([]);
  const [topAssists, setTopAssists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const getGoalInvolvements = () => {
    // Create a map to combine data from both lists
    const playerMap = new Map();

    // Process top scorers
    topScorers.forEach((playerObj) => {
      const id = playerObj.player.id;
      const goals = playerObj.statistics[0].goals.total || 0;
      const assists = 0; // Initialize assists as 0 for scorers
      playerMap.set(id, {
        ...playerObj,
        total: goals + assists,
        goals,
        assists,
      });
    });

    // Process top assists and combine with existing data
    topAssists.forEach((playerObj) => {
      const id = playerObj.player.id;
      const assists = playerObj.statistics[0].goals.assists || 0;
      const existing = playerMap.get(id);

      if (existing) {
        // Player exists in both lists, update assists and total
        existing.assists = assists;
        existing.total += assists;
      } else {
        // New player entry
        const goals = 0;
        playerMap.set(id, {
          ...playerObj,
          total: goals + assists,
          goals,
          assists,
        });
      }
    });

    // Convert map to array and sort by total involvement
    return Array.from(playerMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5); // Take top 5
  };

  const topInvolvements = getGoalInvolvements();

  useEffect(() => {
    const fetchTopStats = async () => {
      try {
        setLoading(true);

        const [scorersRes, assistsRes] = await Promise.all([
          api.get("/players/topscorers", {
            params: { league: 39, season: 2025 },
          }),
          api.get("/players/topassists", {
            params: { league: 39, season: 2025 },
          }),
        ]);

        setTopScorers(scorersRes.data.response);
        setTopAssists(assistsRes.data.response);
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      {/* Most Goal Involvements*/}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-4 text-fuchsia-900">
          Most Goal Involvements
        </h3>
        <div className="space-y-6">
          {topInvolvements.map((playerObj, idx) => {
            const goals = playerObj.goals;
            const assists = playerObj.assists;
            const data = [
              {
                name: "Goals",
                value: goals,
                color: PREMIER_LEAGUE_COLORS.accent2,
              },
              {
                name: "Assists",
                value: assists,
                color: PREMIER_LEAGUE_COLORS.accent1,
              },
            ];

            return (
              <div
                key={playerObj.player.id}
                className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row items-center gap-4"
              >
                {/* Player Info */}
                <div className="flex items-center gap-4 w-full md:w-2/3">
                  <img
                    src={playerObj.player.photo}
                    alt={playerObj.player.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-fuchsia-900">
                      {playerObj.player.name}
                    </h4>
                    <p className="text-xs font-semibold text-fuchsia-900 flex items-center gap-1 mb-2">
                      <img
                        src={playerObj.statistics[0].team.logo}
                        className="w-4 h-4"
                        alt={playerObj.statistics[0].team.name}
                      />
                      {playerObj.statistics[0].team.name}
                    </p>
                    <div className="text-xs font-semibold text-fuchsia-900">
                      {`Total Involvements: ${goals + assists}`}
                    </div>
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="flex items-center justify-center gap-4 w-full md:w-1/3">
                  <ResponsiveContainer width={100} height={100}>
                    <PieChart>
                      <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={40}
                        activeIndex={activeIndex}
                        activeOuterRadius={50} // Makes it enlarge on hover
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                        labelLine={false}
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={50}
                        activeIndex={activeIndex}
                        activeOuterRadius={50}
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                        labelLine={false}
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value}`, name]}
                        contentStyle={{ fontSize: "12px", borderRadius: "8px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Custom Legend */}
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: PREMIER_LEAGUE_COLORS.accent2,
                        }}
                      ></div>
                      <span className="text-fuchsia-900 font-semibold">
                        Goals: {((goals / (goals + assists)) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: PREMIER_LEAGUE_COLORS.accent1,
                        }}
                      ></div>
                      <span className="text-fuchsia-900 font-semibold">
                        Assists:
                        {((assists / (goals + assists)) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Updated PlayerRow component
const PlayerRow = ({ rank, player, team, value, label, meta }) => (
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
    <div className="text-right">
      <span className="font-bold text-emerald-600 block">{value}</span>
      {meta && <span className="text-xs text-gray-500 block">{meta}</span>}
    </div>
  </div>
);

const PlayerBarChart = ({ player, team, goals = 0, assists = 0 }) => {
  const data = [
    { name: "Goals", value: goals },
    { name: "Assists", value: assists },
  ];

  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={player?.photo}
          alt={player?.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold text-fuchsia-900">{player?.name}</p>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <img src={team?.logo} className="w-4 h-4" alt={team?.name} />
            {team?.name}
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          <Bar dataKey="value">
            <Cell fill={PREMIER_LEAGUE_COLORS.accent2} />
            <Cell fill={PREMIER_LEAGUE_COLORS.accent1} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
// Loading spinner remains same
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <div className="w-8 h-8 border-4 border-t-4 border-gray-300 border-t-fuchsia-500 rounded-full animate-spin"></div>
  </div>
);
