import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function Home() {
  const [standings, setStandings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leagueLogo, setLeagueLogo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leagueResponse = await api.get("/leagues?id=39&season=2024");
        setLeagueLogo(leagueResponse.data.response[0].league.logo);

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
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 min-h-[calc(100vh-4rem)] pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1800px] mx-auto h-full flex flex-col">
        <div className="flex items-center justify-center mb-8 space-x-4">
          {leagueLogo && (
            <img
              src={leagueLogo}
              alt="Premier League Logo"
              className="w-16 h-16 object-contain"
              loading="lazy"
              style={{ transform: "translateZ(0)" }}
            />
          )}
          <h1 className="text-3xl font-bold text-fuchsia-900 bg-clip-text bg-gradient-to-r">
            2024/25 Premier League Season
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(800px,2fr)_minmax(300px,1fr)] gap-8 flex-1 pb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-fuchsia-950/10 chrome-fix">
            <h2 className="text-xl font-semibold mb-4 text-fuchsia-950 border-b-2 border-fuchsia-950/30 pb-2">
              League Table
            </h2>
            <div className="overflow-x-auto scrollbar-chrome">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="text-left text-gray-600 bg-gray-50">
                    <th className="px-4 py-3 w-16">Pos</th>
                    <th className="px-4 py-3 min-w-[200px]">Team</th>
                    <th className="px-4 py-3 w-24 text-center">Played</th>
                    <th className="px-4 py-3 w-24 text-center">GD</th>
                    <th className="px-4 py-3 w-48 text-center">Form</th>
                    <th className="px-4 py-3 w-24 text-center">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team) => (
                    <tr
                      key={team.team.id}
                      className="border-b hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-4 py-3 font-medium text-gray-700">
                        {team.rank}
                      </td>
                      <td className="px-4 py-3 flex items-center min-w-[250px]">
                        <img
                          src={team.team.logo}
                          alt={team.team.name}
                          className="w-10 h-10 mr-3 bg-white p-1 rounded-full shadow-sm"
                          loading="lazy"
                        />
                        <span className="font-medium text-gray-900">
                          {team.team.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {team.all.played}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">
                        <span
                          className={`px-2 py-1 rounded ${
                            team.goalsDiff >= 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {team.goalsDiff}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">
                        <div className="flex justify-center space-x-1">
                          {team.form?.split("").map((result, index) => (
                            <span
                              key={index}
                              className={`inline-block w-6 h-6 rounded-full text-xs flex items-center justify-center
                ${
                  result === "W"
                    ? "bg-green-100 text-green-800"
                    : result === "D"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
                            >
                              {result}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-emerald-700">
                        {team.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-fuchsia-950/10 chrome-fix h-full">
            <h2 className="text-xl font-semibold mb-4 text-fuchsia-950 border-b-2 border-fuchsia-950/30 pb-2">
              Recent Matches
            </h2>
            <div className="space-y-4 h-[calc(100%-60px)] overflow-y-auto scroll-container">
              {matches.length === 0 ? (
                <div className="text-center py-4 text-gray-500 h-full flex items-center justify-center">
                  No matches available yet
                </div>
              ) : (
                matches.map((match) => (
                  <div
                    key={match.fixture.id}
                    className="group p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 border-b last:border-0"
                  >
                    {/* Changed to grid layout */}
                    <div className="grid grid-cols-5 items-center gap-4">
                      {/* Home Team */}
                      <div className="col-span-2 flex items-center">
                        <img
                          src={match.teams.home.logo}
                          className="w-10 h-10 mr-3 bg-white p-1 rounded-full shadow-sm flex-shrink-0"
                          alt={match.teams.home.name}
                          loading="lazy"
                        />
                        <span className="font-medium text-gray-800 truncate text-sm">
                          {match.teams.home.name}
                        </span>
                      </div>

                      {/* Score & Date */}
                      <div className="col-span-1 text-center">
                        <div className="font-bold text-lg bg-gray-100 text-gray-900 px-2 py-1 rounded-full mx-auto max-w-[120px]">
                          {match.goals.home ?? "0"} - {match.goals.away ?? "0"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(match.fixture.date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </div>

                      {/* Away Team */}
                      <div className="col-span-2 flex items-center justify-end">
                        <span className="font-medium text-gray-800 truncate text-sm mr-3">
                          {match.teams.away.name}
                        </span>
                        <img
                          src={match.teams.away.logo}
                          className="w-10 h-10 bg-white p-1 rounded-full shadow-sm flex-shrink-0"
                          alt={match.teams.away.name}
                          loading="lazy"
                        />
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
