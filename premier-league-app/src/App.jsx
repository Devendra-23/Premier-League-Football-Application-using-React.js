// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Predictions from "./pages/Predictions";
import StatsPage from "./pages/StatsPage";
import TeamStats from "./pages/TeamStats";
import PlayerStats from "./pages/PlayerStats";

export default function App() {
  return (
    <Router>
      {/* Added Premier League themed background */}
      <div className="font-poppins bg-gradient-to-b from-fuchsia-950/20 to-slate-900 min-h-screen">
        <Navbar />
        <main className="pt-16 min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/stats" element={<StatsPage />}>
              <Route path="team" element={<TeamStats />} />
              <Route path="players" element={<PlayerStats />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}
