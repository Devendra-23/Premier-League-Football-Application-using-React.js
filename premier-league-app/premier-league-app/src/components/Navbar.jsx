// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import PremierLogo from "../assets/PL_Face.png";

export default function Navbar() {
  return (
    <nav className="fixed w-full top-0 h-16 bg-fuchsia-950 text-white shadow-lg z-50">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-emerald-400 transition-transform duration-300 group-hover:scale-110">
              <img
                src={PremierLogo}
                alt="Premier League Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-white bg-clip-text text-transparent">
              Premier League
            </span>
          </Link>
          <div className="flex space-x-8">
            <Link to="/" className="text-2xl font-bold ">
              <span className="text-2xl font-bold text-white hover:text-indigo-300 transition-colors duration-200">
                Home
              </span>
            </Link>
            <Link to="/predictions">
              <span className="text-2xl font-bold text-white hover:text-indigo-300 transition-colors duration-200">
                Predictions
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
