import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Listbox } from "@headlessui/react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PREMIER_LEAGUE_COLORS = {
  primary: "#00ff85",
  secondary: "#38003c",
  accent1: "#04f5ff",
  accent2: "#e90052",
};
export default function TeamStats() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add this useEffect here
  useEffect(() => {
    if (stats) {
      console.log("Full stats object:", JSON.parse(JSON.stringify(stats)));
    }
  }, [stats]);

  // Fetch Premier League teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get("/teams", {
          params: {
            league: 39,
            season: 2025,
          },
        });
        setTeams(response.data.response);
      } catch (err) {
        console.error("Team fetch error:", err);
        setError("Failed to fetch teams.");
      }
    };
    fetchTeams();
  }, []);

  // Fetch stats when a team is selected
  useEffect(() => {
    if (!selectedTeam) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/teams/statistics", {
          params: {
            league: 39,
            season: 2025,
            team: selectedTeam,
          },
        });
        setStats(response.data.response);
      } catch (err) {
        console.error("Stats fetch error:", err);
        setError("Failed to fetch team statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedTeam]);

  const getSafe = (path, fallback = "N/A") => {
    try {
      return path();
    } catch {
      return fallback;
    }
  };

  const CombinedPerformanceChart = () => {
    if (!stats) return null;

    // Prepare data for combined chart
    const performanceData = [
      {
        category: "Wins",
        home: getSafe(() => stats.fixtures.wins.home, 0),
        away: getSafe(() => stats.fixtures.wins.away, 0),
      },
      {
        category: "Draws",
        home: getSafe(() => stats.fixtures.draws.home, 0),
        away: getSafe(() => stats.fixtures.draws.away, 0),
      },
      {
        category: "Losses",
        home: getSafe(() => stats.fixtures.loses.home, 0),
        away: getSafe(() => stats.fixtures.loses.away, 0),
      },
      {
        category: "Goals Scored",
        home: getSafe(() => stats.goals.for.total.home, 0),
        away: getSafe(() => stats.goals.for.total.away, 0),
      },
      {
        category: "Clean Sheets",
        home: getSafe(() => stats.clean_sheet.home, 0),
        away: getSafe(() => stats.clean_sheet.away, 0),
      },
    ];

    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-4 text-fuchsia-900">
          Combined Performance Analysis
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={performanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                angle={0}
                textAnchor="end"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                label={{
                  value: "Number of Matches",
                  angle: -90,
                  position: "insideLeft",
                  style: {
                    textAnchor: "middle",
                    fill: PREMIER_LEAGUE_COLORS.secondary,
                    fontSize: "14px",
                    fontWeight: "bold",
                  },
                }}
                tick={{ fill: PREMIER_LEAGUE_COLORS.secondary }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #f0f0f0",
                  borderRadius: "4px",
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) =>
                  value.charAt(0).toUpperCase() + value.slice(1)
                }
              />
              <Bar
                dataKey="home"
                name="Home Games"
                fill={PREMIER_LEAGUE_COLORS.primary}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="away"
                name="Away Games"
                fill={PREMIER_LEAGUE_COLORS.secondary}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Additional Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <StatCard
            title="Total Wins"
            value={getSafe(
              () => stats.fixtures.wins.home + stats.fixtures.wins.away
            )}
          />
          <StatCard
            title="Total Draws"
            value={getSafe(
              () => stats.fixtures.draws.home + stats.fixtures.draws.away
            )}
          />
          <StatCard
            title="Total Losses"
            value={getSafe(
              () => stats.fixtures.loses.home + stats.fixtures.loses.away
            )}
          />
        </div>
      </div>
    );
  };

  const GoalsByMinuteChart = () => {
    if (!stats?.goals?.for?.minute) return null;

    const minuteData = Object.entries(stats.goals.for.minute).map(
      ([interval, data]) => ({
        interval,
        goals: data.total || 0,
      })
    );

    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-4 text-fuchsia-900">
          Goals by Minute Interval
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={minuteData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="interval"
                label={{
                  value: "Minute Intervals",
                  position: "bottom",
                  offset: -7,
                  style: {
                    textAnchor: "middle",
                    fill: PREMIER_LEAGUE_COLORS.secondary,
                    fontSize: "14px",
                    fontWeight: "bold",
                  },
                }}
                tick={{
                  fill: PREMIER_LEAGUE_COLORS.secondary,
                  angle: 0, // Ensure ticks are horizontal
                }}
              />
              <YAxis
                label={{
                  value: "Goals",
                  angle: -90,
                  position: "insideLeft",
                  style: {
                    textAnchor: "middle",
                    fill: PREMIER_LEAGUE_COLORS.secondary,
                    fontSize: "14px",
                    fontWeight: "bold",
                  },
                }}
                tick={{ fill: PREMIER_LEAGUE_COLORS.secondary }}
              />
              <Tooltip />
              <Bar
                dataKey="goals"
                fill={PREMIER_LEAGUE_COLORS.accent2}
                name="Goals Scored"
              />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const FormationUsageChart = () => {
    if (!stats?.lineups) return null;

    const formationData = stats.lineups
      .sort((a, b) => b.played - a.played)
      .slice(0, 5)
      .map((lineup) => ({
        formation: lineup.formation,
        matches: lineup.played || 0,
      }));

    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formation" />
              <YAxis
                label={{
                  value: "Number of Matches",
                  angle: -90,
                  position: "insideLeft",
                  style: {
                    textAnchor: "middle",
                    fill: PREMIER_LEAGUE_COLORS.secondary,
                    fontSize: "14px",
                    fontWeight: "bold",
                  },
                }}
                tick={{ fill: PREMIER_LEAGUE_COLORS.secondary }}
              />
              <Tooltip />
              <Bar
                dataKey="matches"
                fill={PREMIER_LEAGUE_COLORS.accent1}
                name="Formation Used for number of matches"
              />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const PenaltyStatsChart = () => {
    if (!stats?.penalty) return null;

    const scored = getSafe(() => stats.penalty.scored.total, 0);
    const missed = getSafe(() => stats.penalty.missed.total, 0);
    const total = scored + missed;
    const conversionRate = total > 0 ? ((scored / total) * 100).toFixed(1) : 0;
    const missedRate = total > 0 ? ((missed / total) * 100).toFixed(1) : 0;

    return (
      <div className="bg-white  p-6 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-4 text-fuchsia-900 ">
          Penalties Conversion
          <span className="block text-sm font-normal mt-1 text-fuchsia-900 ">
            ({conversionRate}% Success Rate)
          </span>
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: "Scored", value: scored },
                  { name: "Missed", value: missed },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
              >
                <Cell fill={PREMIER_LEAGUE_COLORS.primary} />
                <Cell fill={PREMIER_LEAGUE_COLORS.accent2} />
              </Pie>

              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-fuchsia-900"
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                {conversionRate}%
              </text>

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border border-fuchsia-900">
                        <p
                          className="font-bold"
                          style={{
                            color:
                              payload[0].payload.name === "Scored"
                                ? PREMIER_LEAGUE_COLORS.primary
                                : PREMIER_LEAGUE_COLORS.accent2,
                          }}
                        >
                          {payload[0].name}
                        </p>
                        <p className="text-fuchsia-900">
                          Count: {payload[0].value}
                        </p>
                        <p className="text-fuchsia-900">
                          Percentage:{" "}
                          {payload[0].payload.name === "Scored"
                            ? conversionRate
                            : missedRate}
                          %
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend
                formatter={(value) => (
                  <span className="text-fuchsia-900">
                    {value} ({value === "Scored" ? conversionRate : missedRate}
                    %)
                  </span>
                )}
                wrapperStyle={{ paddingTop: 20 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  return (
    <div className="space-y-8">
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-fuchsia-900 text-lg">
          Select a Premier League Team:
        </label>
        <Listbox value={selectedTeam} onChange={setSelectedTeam}>
          {({ open }) => (
            <div className="relative z-40">
              <Listbox.Button className="w-full bg-fuchsia-50 dark:bg-fuchsia-50 !bg-fuchsia-50 border border-fuchsia-200 dark:border-fuchsia-200 text-fuchsia-900 dark:text-fuchsia-900 font-medium rounded-lg px-4 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 flex justify-between items-cente">
                <div className="flex items-center gap-2">
                  {selectedTeam && (
                    <img
                      src={
                        teams.find((t) => t.team.id == selectedTeam)?.team.logo
                      }
                      alt="Team logo"
                      className="w-5 h-5 rounded-full"
                    />
                  )}
                  <span>
                    {selectedTeam
                      ? teams.find((t) => t.team.id == selectedTeam)?.team.name
                      : "-- Choose a team --"}
                  </span>
                </div>
                <svg
                  className="w-5 h-5 text-fuchsia-600 ml-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Listbox.Button>

              {open && (
                <Listbox.Options className="absolute mt-2 w-full bg-white border border-fuchsia-200 rounded-lg shadow-lg max-h-60 overflow-auto z-50">
                  {teams.map((teamObj) => (
                    <Listbox.Option
                      key={teamObj.team.id}
                      value={teamObj.team.id}
                      className={({ active, selected }) =>
                        `cursor-pointer select-none px-4 py-2 ${
                          active
                            ? "bg-fuchsia-100 text-fuchsia-900"
                            : selected
                            ? "bg-fuchsia-200 text-fuchsia-900 font-semibold"
                            : "text-gray-800"
                        }`
                      }
                    >
                      <div className="flex items-center">
                        <img
                          src={teamObj.team.logo}
                          alt={teamObj.team.name}
                          className="w-5 h-5 mr-2 rounded-full"
                        />
                        {teamObj.team.name}
                      </div>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              )}
            </div>
          )}
        </Listbox>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !stats && selectedTeam && (
        <p className="text-gray-500">No stats available.</p>
      )}

      {stats && (
        <>
          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Matches Played"
              value={getSafe(() => stats.fixtures.played.total)}
            />
            <StatCard
              title="Goals Scored"
              value={getSafe(() => stats.goals.for.total.total)}
            />
            <StatCard
              title="Goals Conceded"
              value={getSafe(() => stats.goals.against.total.total)}
            />
            <StatCard
              title="Clean Sheets"
              value={getSafe(() => stats.clean_sheet.total)}
            />
          </div>
          <CombinedPerformanceChart />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-bold mb-4 text-fuchsia-900">
                Home Performance
              </h3>
              <div className="space-y-2">
                <StatRow
                  title="Wins"
                  value={getSafe(() => stats.fixtures.wins.home)}
                />
                <StatRow
                  title="Goals"
                  value={getSafe(() => stats.goals.for.total.home)}
                />
                <StatRow
                  title="Clean Sheets"
                  value={getSafe(() => stats.clean_sheet.home)}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-bold mb-4 text-fuchsia-900">
                Away Performance
              </h3>
              <div className="space-y-2">
                <StatRow
                  title="Wins"
                  value={getSafe(() => stats.fixtures.wins.away)}
                />
                <StatRow
                  title="Goals"
                  value={getSafe(() => stats.goals.for.total.away)}
                />
                <StatRow
                  title="Clean Sheets"
                  value={getSafe(() => stats.clean_sheet.away)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-4 text-fuchsia-900">
              Most Used Formations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stats.lineups
                ?.sort((a, b) => b.played - a.played)
                .slice(0, 3)
                .map((formation, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 p-4 rounded-lg text-center"
                  >
                    <div className="text-xl font-bold text-fuchsia-900">
                      {getSafe(() => formation.formation)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Used {getSafe(() => formation.played)} times
                    </div>
                  </div>
                ))}
            </div>
            <FormationUsageChart />
          </div>

          {/* <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-4 text-fuchsia-900">
              Goals by Minute Interval
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="0-15' Goals"
                value={getSafe(() => stats.goals.for.minute["0-15"].total)}
              />
              <StatCard
                title="16-30' Goals"
                value={getSafe(() => stats.goals.for.minute["16-30"].total)}
              />
              <StatCard
                title="31-45' Goals"
                value={getSafe(() => stats.goals.for.minute["31-45"].total)}
              />
              <StatCard
                title="46-60' Goals"
                value={getSafe(() => stats.goals.for.minute["46-60"].total)}
              />
              <StatCard
                title="61-75' Goals"
                value={getSafe(() => stats.goals.for.minute["46-60"].total)}
              />
              <StatCard
                title="76-90' Goals"
                value={getSafe(() => stats.goals.for.minute["46-60"].total)}
              />
              <StatCard
                title="91-105' Goals"
                value={getSafe(() => stats.goals.for.minute["46-60"].total)}
              />
              <StatCard
                title="106-110' Goals"
                value={getSafe(() => stats.goals.for.minute["46-60"].total)}
              />
            </div>
          </div> */}
          <GoalsByMinuteChart />

          {/* Penalties */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-4 text-fuchsia-900">
              Penalties
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <PenaltyStatsChart />

              <StatCard
                title="Penalties Rewarded"
                value={getSafe(
                  () => stats.penalty.missed.total + stats.penalty.scored.total
                )}
              />
              <StatCard
                title="Penalties Scored"
                value={getSafe(() => stats.penalty.scored.total)}
              />
              <StatCard
                title="Penalties Missed"
                value={getSafe(() => stats.penalty.missed.total)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Reusable components
const StatCard = ({ title, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg text-center">
    <h4 className="text-sm text-gray-600 mb-1">{title}</h4>
    <p className="text-2xl font-bold text-fuchsia-900">{value}</p>
  </div>
);

const StatRow = ({ title, value }) => (
  <div className="flex justify-between items-center py-2 border-b">
    <span className="text-gray-600">{title}</span>
    <span className="font-medium text-fuchsia-900">{value}</span>
  </div>
);

// Loading Spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <div className="w-8 h-8 border-4 border-gray-300 border-t-fuchsia-500 rounded-full animate-spin"></div>
  </div>
);
