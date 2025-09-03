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
        const leagueResponse = await api.get("/leagues?id=39&season=2025");
        setLeagueLogo(leagueResponse.data.response[0].league.logo);

        // Fetch 2025-2026 season standings
        const standingsResponse = await api.get(
          "/standings?season=2025&league=39"
        );

        if (standingsResponse.data.response.length === 0) {
          throw new Error("2025-2026 season data not available yet");
        }

        setStandings(standingsResponse.data.response[0].league.standings[0]);

        // Fetch 2025-2026 season matches
        const matchesResponse = await api.get(
          "/fixtures?league=39&season=2025&last=10"
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
          Note: 2025-2026 data becomes available when the season starts
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
            2025/26 Premier League Season
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(800px,2fr)_minmax(300px,1fr)] gap-8 flex-1 pb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-fuchsia-950/10 chrome-fix">
            <h2 className="text-xl font-semibold mb-4 text-fuchsia-950 border-b-2 border-fuchsia-950/30 pb-2">
              League Table
            </h2>
            <div className="overflow-x-auto scrollbar-chrome">
              <table className="w-full table-fixed text-xs sm:text-sm">
                <thead>
                  <tr className="text-gray-600 bg-gray-50">
                    <th className="px-2 py-2 w-[40px] sm:w-[50px] lg:w-[70px] text-center">
                      Pos
                    </th>
                    <th className="px-2 py-2 w-[140px] text-left">Team</th>
                    <th className="px-2 py-2 w-[60px] text-center">Played</th>
                    <th className="px-2 py-2 w-[60px] text-center">GD</th>
                    <th className="px-2 py-2 w-[100px] text-center">Form</th>
                    <th className="px-2 py-2 w-[60px] text-center">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team) => (
                    <tr
                      key={team.team.id}
                      className="border-b hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-2 py-2 font-medium text-gray-700 text-center">
                        {team.rank}
                      </td>
                      <td className="px-2 py-2 flex items-center">
                        <img
                          src={team.team.logo}
                          alt={team.team.name}
                          className="w-10 h-10 mr-3 bg-white p-1 rounded-full shadow-sm"
                          loading="lazy"
                        />
                        <span className="font-medium text-gray-900 truncate text-xs sm:text-sm max-w-[80px] sm:max-w-none">
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
                    <div className="flex flex-col items-center text-center sm:grid sm:grid-cols-5 sm:items-center sm:gap-4">
                      {/* Home Team */}
                      <div className="flex items-center justify-center sm:justify-start sm:col-span-2 w-full">
                        <img
                          src={match.teams.home.logo}
                          className="w-8 h-8 sm:w-10 sm:h-10 mr-2 bg-white p-1 rounded-full shadow-sm flex-shrink-0"
                          alt={match.teams.home.name}
                          loading="lazy"
                        />
                        <span className="font-medium text-gray-800 truncate text-sm sm:text-base max-w-[100px] sm:max-w-none">
                          {match.teams.home.name}
                        </span>
                      </div>

                      {/* Score & Date */}
                      <div className="my-2 sm:my-0 sm:col-span-1 text-center">
                        <div className="font-bold text-sm sm:text-lg bg-gray-100 text-gray-900 px-2 py-1 rounded-full mx-auto max-w-[80px] sm:max-w-[120px]">
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
                      <div className="flex items-center justify-center sm:justify-end sm:col-span-2 w-full">
                        <span className="font-medium text-gray-800 truncate text-sm sm:text-base max-w-[100px] sm:max-w-none mr-2 sm:mr-3">
                          {match.teams.away.name}
                        </span>
                        <img
                          src={match.teams.away.logo}
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-white p-1 rounded-full shadow-sm flex-shrink-0"
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
