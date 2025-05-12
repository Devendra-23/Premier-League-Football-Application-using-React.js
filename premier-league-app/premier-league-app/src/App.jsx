import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Predictions from "./pages/Predictions";

export default function App() {
  return (
    <Router>
      <div className="font-poppins bg-gray-50 min-h-screen">
        <Navbar />
        <main className="pt-16 min-h-[calc(100vh-4rem)] chrome-fix">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predictions" element={<Predictions />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
