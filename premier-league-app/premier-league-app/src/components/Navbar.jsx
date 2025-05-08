// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed w-full top-0 h-16 bg-fuchsia-950 text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-emerald-400">
            PL 24/25
          </Link>
          <div className="flex space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/predictions"
              className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
            >
              Predictions
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
