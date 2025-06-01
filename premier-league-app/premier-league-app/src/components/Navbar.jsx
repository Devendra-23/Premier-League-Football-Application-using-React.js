import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PremierLogo from "../assets/PL_Face.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed w-full top-0 h-16 bg-fuchsia-950 text-white shadow-lg z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
            onClick={closeMenu}
          >
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

          {/* Desktop Navigation */}
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
            <Link
              to="/stats"
              className="text-2xl font-bold text-white hover:text-indigo-300 transition-colors duration-200"
            >
              Stats
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-3 rounded-lg hover:bg-fuchsia-900 transition-colors"
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

        {/* Mobile Navigation Menu - Corner Dropdown with Rotating Animation */}
        <div
          className={`md:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={closeMenu}
        >
          {/* Corner dropdown panel */}
          <div
            className={`absolute top-[4.5rem] right-4 w-56 bg-fuchsia-900 rounded-xl shadow-2xl transform transition-all duration-300 origin-top-right ${
              isOpen
                ? "scale-100 opacity-100 rotate-0"
                : "scale-95 opacity-0 rotate-[-5deg]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col p-4 space-y-2">
              <Link
                to="/"
                className="text-xl font-bold text-white hover:bg-fuchsia-800 transition-all duration-300 py-3 px-4 rounded-lg transform hover:translate-x-2 hover:rotate-1"
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  <span className="flex-1">Home</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
              </Link>
              <Link
                to="/predictions"
                className="text-xl font-bold text-white hover:bg-fuchsia-800 transition-all duration-300 py-3 px-4 rounded-lg transform hover:translate-x-2 hover:rotate-1 delay-100"
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  <span className="flex-1">Predictions</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </Link>
              <Link
                to="/stats"
                className="text-xl font-bold text-white hover:bg-fuchsia-800 transition-all duration-300 py-3 px-4 rounded-lg transform hover:translate-x-2 hover:rotate-1 delay-200"
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  <span className="flex-1">Stats</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
