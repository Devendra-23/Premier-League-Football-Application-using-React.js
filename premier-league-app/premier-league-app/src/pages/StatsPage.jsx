import { NavLink, Outlet } from "react-router-dom";

export default function StatsPage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <nav className="flex gap-6 mb-8 border-b-2 border-fuchsia-100 pb-4">
        <NavLink
          to="/stats/team"
          className={({ isActive }) =>
            `text-2xl font-bold rounded-lg px-2 pb-1 ${
              isActive
                ? "bg-gradient-to-r from-indigo-600 to-white bg-clip-text text-transparent border-b-4 border-emerald-400"
                : "text-fuchsia-900 hover:bg-fuchsia-100"
            }`
          }
        >
          Team Statistics
        </NavLink>
        <NavLink
          to="/stats/players"
          className={({ isActive }) =>
            `text-2xl font-bold rounded-lg px-2 pb-1 ${
              isActive
                ? "bg-gradient-to-r from-indigo-600 to-white bg-clip-text text-transparent border-b-4 border-emerald-400"
                : "text-fuchsia-900 hover:bg-fuchsia-100"
            }`
          }
        >
          Player Statistics
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
