import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Predictions from "./pages/Predictions";

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20">
        {" "}
        {/* Added padding-top for navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predictions" element={<Predictions />} />
        </Routes>
      </main>
    </Router>
  );
}
