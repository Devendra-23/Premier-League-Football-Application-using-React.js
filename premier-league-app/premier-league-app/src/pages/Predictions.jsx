// src/pages/Predictions.jsx
export default function Predictions() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Season Predictions
        </h1>

        {/* Prediction Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Title Probability Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Title Winning Probabilities
            </h2>
            <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              Chart Placeholder
            </div>
          </div>

          {/* Prediction Form Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Make Your Prediction
            </h2>
            <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              Form Placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
