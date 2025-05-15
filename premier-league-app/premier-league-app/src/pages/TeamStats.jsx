import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Listbox } from "@headlessui/react";

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
            season: 2024,
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
            season: 2024,
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

          {/* Home/Away Split */}
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
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
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
          </div>

          {/* Penalties */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-4 text-fuchsia-900">
              Penalties
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
