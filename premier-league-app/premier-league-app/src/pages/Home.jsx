export default function Home() {
  return (
    <div className="w-full bg-gray-50 min-h-screen pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          2024/25 Premier League Season
        </h1>

        {/* Grid container - modified height control */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 pb-8">
          {/* League Table */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Current Standings
            </h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              League Table Placeholder
            </div>
          </div>

          {/* Recent Matches */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Recent Matches
            </h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              Matches Placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
