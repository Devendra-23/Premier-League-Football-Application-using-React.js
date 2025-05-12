import { Link } from "react-router-dom";
import { useState } from "react";
import PremierLogo from "../assets/PL_Face.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 h-16 bg-fuchsia-950 text-white shadow-lg z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-emerald-400 transition-transform duration-300 group-hover:scale-110">
              <img
                src={PremierLogo}
                alt="Premier League Logo"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-white bg-clip-text text-transparent">
              Premier League
            </span>
          </Link>

          {/* Desktop Navigation - Fixed typo from fhidden to hidden */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-2xl font-bold text-white hover:text-indigo-300 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/predictions"
              className="text-2xl font-bold text-white hover:text-indigo-300 transition-colors duration-200"
            >
              Predictions
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-fuchsia-900 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${isOpen ? "block" : "hidden"} pb-4`}>
          <div className="flex flex-col space-y-4 mt-4">
            <Link
              to="/"
              className="text-xl font-bold text-white hover:text-indigo-300 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/predictions"
              className="text-xl font-bold text-white hover:text-indigo-300 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Predictions
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
