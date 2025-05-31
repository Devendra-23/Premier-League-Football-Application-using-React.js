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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );

  if (error)
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );

  // Premier League color scheme
  const plColors = {
    primary: "#38003c",
    secondary: "#00ff85",
    background: "#f5f5f5",
    rowEven: "#ffffff",
    rowOdd: "#f9f9f9",
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          <h1 className="text-4xl font-bold ml-4 bg-gradient-to-r from-purple-800 to-pink-600 bg-clip-text text-transparent">
            2025-2026 Premier League Predictions
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Based on historical performance data and machine learning analysis,
          these are the predicted top 6 teams for the upcoming season
        </p>
      </div>

      {/* Premier League Probability Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead
            className="text-white"
            style={{ backgroundColor: plColors.primary }}
          >
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider"
              >
                Pos
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
              >
                Team
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider"
              >
                Probability
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {top6Teams.map((team, index) => (
              <tr
                key={team.team}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full mr-3 flex items-center justify-center border-2 border-gray-300">
                      <span className="text-xs font-bold text-gray-700">
                        {team.team.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-2">
                      <div className="text-lg font-bold text-gray-900">
                        {team.team}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col items-center">
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                      <div
                        className="h-4 rounded-full"
                        style={{
                          width: `${
                            (team.probability || team.top_6_prob_2025) * 100
                          }%`,
                          backgroundColor: plColors.primary,
                        }}
                      ></div>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {Math.round(
                        (team.probability || team.top_6_prob_2025) * 100
                      )}
                      %
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Key Statistics Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-600">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Prediction Confidence
          </h3>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-purple-600">
              {Math.round(top6Teams[0]?.probability * 100 || 93)}%
            </p>
            <span className="ml-2 text-gray-500">confidence</span>
          </div>
          <p className="text-gray-600 mt-2">For the top team prediction</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Most Likely Champion
          </h3>
          <div className="flex items-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-700">
                {top6Teams[0]?.team.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="ml-4">
              <p className="text-xl font-bold">
                {top6Teams[0]?.team || "Liverpool"}
              </p>
              <p className="text-gray-600 mt-1">
                {Math.round(top6Teams[0]?.probability * 100 || 93)}% probability
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Biggest Improver
          </h3>
          <div className="flex items-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-700">
                {top6Teams[3]?.team.substring(0, 2).toUpperCase() || "NC"}
              </span>
            </div>
            <div className="ml-4">
              <p className="text-xl font-bold">
                {top6Teams[3]?.team || "Newcastle"}
              </p>
              <p className="text-gray-600 mt-1">
                {Math.round(top6Teams[3]?.probability * 100 || 78)}% probability
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
