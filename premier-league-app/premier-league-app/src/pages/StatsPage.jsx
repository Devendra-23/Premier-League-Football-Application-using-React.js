// StatsPage.jsx
import { Link, Outlet } from "react-router-dom";

export default function StatsPage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <nav className="flex gap-4 mb-8 border-b-2 border-fuchsia-100 pb-4">
        <Link
          to="/stats/team"
          className="px-4 py-2 rounded-lg hover:bg-fuchsia-50 text-fuchsia-900 font-medium"
        >
          Team Statistics
        </Link>
        <Link
          to="/stats/players"
          className="px-4 py-2 rounded-lg hover:bg-fuchsia-50 text-fuchsia-900 font-medium"
        >
          Player Statistics
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}
