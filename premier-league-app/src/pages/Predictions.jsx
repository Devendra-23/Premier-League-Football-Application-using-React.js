// import { useEffect, useState } from "react";
// import { api } from "../services/api"; // Import your API service

// export default function Predictions() {
//   const [top6Teams, setTop6Teams] = useState([]);
//   const [teamLogos, setTeamLogos] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [logoLoading, setLogoLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [logoErrors, setLogoErrors] = useState({});

//   // Premier League color scheme
//   const plColors = {
//     primary: "#38003c",
//     secondary: "#00ff85",
//     background: "#f5f5f5",
//     rowEven: "#ffffff",
//     rowOdd: "#f9f9f9",
//   };

//   useEffect(() => {
//     async function fetchTop6() {
//       try {
//         const res = await fetch("http://127.0.0.1:8000/top6-predictions");
//         if (!res.ok) throw new Error("Failed to fetch predictions");
//         const data = await res.json();
//         setTop6Teams(data);
//         fetchTeamLogos(data.map((team) => team.team));
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchTop6();
//   }, []);

//   const fetchTeamLogos = async (teamNames) => {
//     try {
//       const logoMap = {};

//       // Fetch all teams in Premier League using your API service
//       const response = await api.get("/teams", {
//         params: {
//           league: 39, // Premier League ID
//           season: 2024,
//         },
//       });

//       // Create mapping of team names to logos
//       response.data.response.forEach((teamInfo) => {
//         const teamName = teamInfo.team.name;
//         logoMap[teamName] = teamInfo.team.logo;
//       });

//       setTeamLogos(logoMap);
//     } catch (err) {
//       console.error("Error fetching team logos:", err);
//     } finally {
//       setLogoLoading(false);
//     }
//   };

//   // Get logo URL for a team name
//   const getTeamLogo = (teamName) => {
//     // Try to match by exact name first
//     if (teamLogos[teamName]) return teamLogos[teamName];

//     // Handle common name variations
//     const variations = {
//       "Manchester United": ["Man United", "Man Utd"],
//       "Manchester City": ["Man City"],
//       Tottenham: ["Tottenham Hotspur"],
//       Newcastle: ["Newcastle United"],
//       Brighton: ["Brighton & Hove Albion"],
//       "Nottingham Forest": ["Nott'ham Forest"],
//       "Aston Villa": ["Aston Villa FC"],
//     };

//     for (const [correctName, aliases] of Object.entries(variations)) {
//       if (aliases.includes(teamName) && teamLogos[correctName]) {
//         return teamLogos[correctName];
//       }
//     }

//     return null;
//   };

//   // Combined loading state
//   const isLoading = loading || logoLoading;

//   if (isLoading)
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
//       </div>
//     );

//   if (error)
//     return (
//       <div
//         className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto"
//         role="alert"
//       >
//         <strong className="font-bold">Error: </strong>
//         <span className="block sm:inline">{error}</span>
//       </div>
//     );

//   return (
//     <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 min-h-[calc(100vh-4rem)] pt-16">
//       <div className="py-8 max-w-7xl mx-auto px-4">
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center justify-center mb-4">
//             <h1 className="text-4xl font-bold ml-4 bg-gradient-to-r from-purple-800 to-pink-600 bg-clip-text text-transparent">
//               2025-2026 Premier League Predictions
//             </h1>
//           </div>
//           <p className="text-fuchsia-900 max-w-2xl mx-auto ">
//             Based on historical performance data and machine learning analysis,
//             these are the predicted top 6 teams for the upcoming season
//           </p>
//         </div>

//         {/* Premier League Probability Table */}
//         <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead
//               className="text-white"
//               style={{ backgroundColor: plColors.primary }}
//             >
//               <tr>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider"
//                 >
//                   Pos
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
//                 >
//                   Team
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider"
//                 >
//                   Probability
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {top6Teams.map((team, index) => {
//                 const logoUrl = getTeamLogo(team.team);
//                 const probability =
//                   team.probability || team.top_6_prob_2025 || 0;
//                 const probabilityPercent = Math.round(probability * 100);

//                 return (
//                   <tr
//                     key={team.team}
//                     className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-center">
//                       <div className="text-xl font-bold text-fuchsia-900">
//                         {index + 1}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-12 w-12 rounded-full mr-3 flex items-center justify-center border-2 border-gray-300 overflow-hidden bg-white">
//                           {logoUrl ? (
//                             <>
//                               <img
//                                 src={logoUrl}
//                                 alt={team.team}
//                                 className="w-full h-full object-contain p-1"
//                                 onError={() =>
//                                   setLogoErrors((prev) => ({
//                                     ...prev,
//                                     [team.team]: true,
//                                   }))
//                                 }
//                               />
//                               {logoErrors[team.team] && (
//                                 <div className="absolute inset-0 flex items-center justify-center bg-white">
//                                   <span className="text-xs font-bold text-fuchsia-900">
//                                     {team.team.substring(0, 2).toUpperCase()}
//                                   </span>
//                                 </div>
//                               )}
//                             </>
//                           ) : (
//                             <span className="text-xs font-bold text-fuchsia-900">
//                               {team.team.substring(0, 2).toUpperCase()}
//                             </span>
//                           )}
//                         </div>
//                         <div className="ml-2">
//                           <div className="text-lg font-bold text-fuchsia-900">
//                             {team.team}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex flex-col items-center">
//                         <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
//                           <div
//                             className="h-4 rounded-full"
//                             style={{
//                               width: `${probabilityPercent}%`,
//                               backgroundColor: plColors.secondary,
//                             }}
//                           ></div>
//                         </div>
//                         <span className="text-xl font-bold text-fuchsia-900">
//                           {probabilityPercent}%
//                         </span>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* Key Statistics Section */}
//         <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-600">
//             <h3 className="text-lg font-bold text-fuchsia-900 mb-2">
//               Prediction Confidence
//             </h3>
//             <div className="flex items-baseline">
//               <p className="text-3xl font-bold text-purple-600">
//                 {Math.round(top6Teams[0]?.probability * 100 || 93)}%
//               </p>
//             </div>
//             <p className="text-fuchsia-900 mt-2 font-bold">
//               For the top6 teams prediction
//             </p>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
//             <h3 className="text-lg font-bold text-fuchsia-900 mb-2">
//               Most Likely Champions
//             </h3>
//             <div className="flex items-center">
//               <div className="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center border-2 border-gray-300 overflow-hidden bg-white">
//                 {top6Teams[0]?.team && getTeamLogo(top6Teams[0].team) ? (
//                   <img
//                     src={getTeamLogo(top6Teams[0].team)}
//                     alt={top6Teams[0].team}
//                     className="w-full h-full object-contain p-1"
//                   />
//                 ) : (
//                   <span className="text-xs font-bold text-fuchsia-900">
//                     {top6Teams[0]?.team?.substring(0, 2).toUpperCase() || "PL"}
//                   </span>
//                 )}
//               </div>
//               <div className="ml-4">
//                 <p className="text-xl font-bold text-fuchsia-900">
//                   {top6Teams[0]?.team || "Liverpool"}
//                 </p>
//                 <p className="text-fuchsia-900 mt-1 font-bold">
//                   {Math.round(top6Teams[0]?.probability * 100 || 93)}%
//                   probability
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
//             <h3 className="text-lg font-bold text-fuchsia-900 mb-2">
//               Likely to Climb Most Positions
//             </h3>
//             <div className="flex items-center">
//               <div className="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center border-2 border-gray-300 overflow-hidden bg-white">
//                 {top6Teams[3]?.team && getTeamLogo(top6Teams[3].team) ? (
//                   <img
//                     src={getTeamLogo(top6Teams[3].team)}
//                     alt={top6Teams[3].team}
//                     className="w-full h-full object-contain p-1"
//                   />
//                 ) : (
//                   <span className="text-xs font-bold text-fuchsia-900">
//                     {top6Teams[3]?.team?.substring(0, 2).toUpperCase() || "NC"}
//                   </span>
//                 )}
//               </div>
//               <div className="ml-4">
//                 <p className="text-xl font-bold text-fuchsia-900">
//                   {top6Teams[3]?.team || "Newcastle"}
//                 </p>
//                 <p className="text-fuchsia-900 mt-1 font-bold">
//                   {Math.round(top6Teams[3]?.probability * 100 || 78)}%
//                   probability
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { api } from "../services/api"; // Import your API service

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://ml-silent-pine-9829.fly.dev";

export default function Predictions() {
  const [top6Teams, setTop6Teams] = useState([]);
  const [teamLogos, setTeamLogos] = useState({});
  const [loading, setLoading] = useState(true);
  const [logoLoading, setLogoLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoErrors, setLogoErrors] = useState({});

  // Premier League color scheme
  const plColors = {
    primary: "#38003c",
    secondary: "#00ff85",
    background: "#f5f5f5",
    rowEven: "#ffffff",
    rowOdd: "#f9f9f9",
  };

  useEffect(() => {
    async function fetchTop6() {
      try {
        const res = await fetch(`${API_BASE_URL}/top6-predictions`);
        if (!res.ok) throw new Error("Failed to fetch predictions");
        const data = await res.json();
        setTop6Teams(data);
        fetchTeamLogos(data.map((team) => team.team));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTop6();
  }, []);

  const fetchTeamLogos = async (teamNames) => {
    try {
      const logoMap = {};

      // Fetch all teams in Premier League using your API service
      const response = await api.get("/teams", {
        params: {
          league: 39, // Premier League ID
          season: 2024,
        },
      });

      // Create mapping of team names to logos
      response.data.response.forEach((teamInfo) => {
        const teamName = teamInfo.team.name;
        logoMap[teamName] = teamInfo.team.logo;
      });

      setTeamLogos(logoMap);
    } catch (err) {
      console.error("Error fetching team logos:", err);
    } finally {
      setLogoLoading(false);
    }
  };

  // Get logo URL for a team name
  const getTeamLogo = (teamName) => {
    if (teamLogos[teamName]) return teamLogos[teamName];

    const variations = {
      "Manchester United": ["Man United", "Man Utd"],
      "Manchester City": ["Man City"],
      Tottenham: ["Tottenham Hotspur"],
      Newcastle: ["Newcastle United"],
      Brighton: ["Brighton & Hove Albion"],
      "Nottingham Forest": ["Nott'ham Forest"],
      "Aston Villa": ["Aston Villa FC"],
    };

    for (const [correctName, aliases] of Object.entries(variations)) {
      if (aliases.includes(teamName) && teamLogos[correctName]) {
        return teamLogos[correctName];
      }
    }

    return null;
  };

  const isLoading = loading || logoLoading;

  if (isLoading)
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

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 min-h-[calc(100vh-4rem)] pt-16">
      <div className="py-8 max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <h1 className="text-4xl font-bold ml-4 bg-gradient-to-r from-purple-800 to-pink-600 bg-clip-text text-transparent">
              2025-2026 Premier League Predictions
            </h1>
          </div>
          <p className="text-fuchsia-900 max-w-2xl mx-auto ">
            Based on historical performance data and machine learning analysis,
            these are the predicted top 6 teams for the upcoming season
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead
              className="text-white"
              style={{ backgroundColor: plColors.primary }}
            >
              <tr>
                <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">
                  Pos
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">
                  Probability
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {top6Teams.map((team, index) => {
                const logoUrl = getTeamLogo(team.team);
                const probability =
                  team.probability || team.top_6_prob_2025 || 0;
                const probabilityPercent = Math.round(probability * 100);

                return (
                  <tr
                    key={team.team}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 text-center font-bold text-fuchsia-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full mr-3 border-2 border-gray-300 overflow-hidden bg-white">
                          {logoUrl ? (
                            <img
                              src={logoUrl}
                              alt={team.team}
                              className="w-full h-full object-contain p-1"
                              onError={() =>
                                setLogoErrors((prev) => ({
                                  ...prev,
                                  [team.team]: true,
                                }))
                              }
                            />
                          ) : (
                            <span className="text-xs font-bold text-fuchsia-900">
                              {team.team.substring(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="ml-2">
                          <div className="text-lg font-bold text-fuchsia-900">
                            {team.team}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center">
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                          <div
                            className="h-4 rounded-full"
                            style={{
                              width: `${probabilityPercent}%`,
                              backgroundColor: plColors.secondary,
                            }}
                          ></div>
                        </div>
                        <span className="text-xl font-bold text-fuchsia-900">
                          {probabilityPercent}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-600">
            <h3 className="text-lg font-bold text-fuchsia-900 mb-2">
              Prediction Confidence
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {Math.round(top6Teams[0]?.probability * 100 || 93)}%
            </p>
            <p className="text-fuchsia-900 mt-2 font-bold">
              For the top6 teams prediction
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
            <h3 className="text-lg font-bold text-fuchsia-900 mb-2">
              Most Likely Champions
            </h3>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full border-2 border-gray-300 overflow-hidden bg-white">
                {top6Teams[0]?.team && getTeamLogo(top6Teams[0].team) ? (
                  <img
                    src={getTeamLogo(top6Teams[0].team)}
                    alt={top6Teams[0].team}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <span className="text-xs font-bold text-fuchsia-900">
                    {top6Teams[0]?.team?.substring(0, 2).toUpperCase() || "PL"}
                  </span>
                )}
              </div>
              <div className="ml-4">
                <p className="text-xl font-bold text-fuchsia-900">
                  {top6Teams[0]?.team || "Liverpool"}
                </p>
                <p className="text-fuchsia-900 mt-1 font-bold">
                  {Math.round(top6Teams[0]?.probability * 100 || 93)}%
                  probability
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
            <h3 className="text-lg font-bold text-fuchsia-900 mb-2">
              Likely to Climb Most Positions
            </h3>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full border-2 border-gray-300 overflow-hidden bg-white">
                {top6Teams[3]?.team && getTeamLogo(top6Teams[3].team) ? (
                  <img
                    src={getTeamLogo(top6Teams[3].team)}
                    alt={top6Teams[3].team}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <span className="text-xs font-bold text-fuchsia-900">
                    {top6Teams[3]?.team?.substring(0, 2).toUpperCase() || "NC"}
                  </span>
                )}
              </div>
              <div className="ml-4">
                <p className="text-xl font-bold text-fuchsia-900">
                  {top6Teams[3]?.team || "Newcastle"}
                </p>
                <p className="text-fuchsia-900 mt-1 font-bold">
                  {Math.round(top6Teams[3]?.probability * 100 || 78)}%
                  probability
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
