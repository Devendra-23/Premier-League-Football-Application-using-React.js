import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function Home() {
  const [standings, setStandings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch 2024-2025 season standings
        const standingsResponse = await api.get(
          "/standings?season=2024&league=39"
        );

        if (standingsResponse.data.response.length === 0) {
          throw new Error("2024-2025 season data not available yet");
        }

        setStandings(standingsResponse.data.response[0].league.standings[0]);

        // Fetch 2024-2025 season matches
        const matchesResponse = await api.get(
          "/fixtures?league=39&season=2024&last=10"
        );
        setMatches(matchesResponse.data.response);
      } catch (error) {
        setError(error.message);
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading season data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
        <p className="text-gray-600">{error}</p>
        <p className="mt-2 text-sm text-gray-500">
          Note: 2024-2025 data becomes available when the season starts
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          2024/25 Premier League Season
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 pb-8">
          {/* Current Standings Table */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Current Standings
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="pb-2 px-2">Pos</th>
                    <th className="pb-2">Team</th>
                    <th className="pb-2 px-2">P</th>
                    <th className="pb-2 px-2">GD</th>
                    <th className="pb-2 px-2">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team) => (
                    <tr
                      key={team.team.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-2 text-center">{team.rank}</td>
                      <td className="py-3 flex items-center">
                        <img
                          src={team.team.logo}
                          alt={team.team.name}
                          className="w-8 h-8 mr-3"
                          loading="lazy"
                        />
                        <span className="font-medium">{team.team.name}</span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        {team.all.played}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {team.goalsDiff}
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-emerald-600">
                        {team.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Matches Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Recent Matches
            </h2>
            <div className="space-y-4">
              {matches.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No matches available yet
                </div>
              ) : (
                matches.map((match) => (
                  <div
                    key={match.fixture.id}
                    className="border-b pb-4 last:border-0 hover:bg-gray-50 rounded px-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center w-1/3">
                        <img
                          src={match.teams.home.logo}
                          className="w-8 h-8 mr-2"
                          alt={match.teams.home.name}
                          loading="lazy"
                        />
                        <span className="truncate font-medium">
                          {match.teams.home.name}
                        </span>
                      </div>
                      <div className="text-center w-1/3">
                        <div className="font-semibold text-lg">
                          {match.goals.home ?? "-"} - {match.goals.away ?? "-"}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(match.fixture.date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="flex items-center justify-end w-1/3">
                        <img
                          src={match.teams.away.logo}
                          className="w-8 h-8 mr-2"
                          alt={match.teams.away.name}
                          loading="lazy"
                        />
                        <span className="truncate font-medium">
                          {match.teams.away.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
