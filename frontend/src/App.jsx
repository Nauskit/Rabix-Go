import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Restaurants from "../pages/Restaurants";
import Navbar from "../components/Navbar";
import RestaurantDetail from "../pages/RestaurantDetail";

function App() {
  // ── Global user state ──────────────────────────────────────
  // Reads from localStorage on mount so refresh doesn't log out
  const [user, setUser] = useState(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("accessToken");
    return username && token ? { username } : null;
  });

  // Sync user state if Login page sets localStorage directly
  // (Login.jsx ต้อง dispatch event "auth" หลัง setItem — ดูด้านล่าง)
  useEffect(() => {
    function onAuth() {
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("accessToken");
      setUser(username && token ? { username } : null);
    }
    window.addEventListener("auth", onAuth);
    return () => window.removeEventListener("auth", onAuth);
  }, []);
  return (
    <div
      className="min-h-screen bg-[#0a0a0f] text-[#f0f0f8]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Navbar user={user} onLogout={() => setUser(null)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurants" element={<Restaurants user={user} />} />
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />
      </Routes>
    </div>
  );
}

export default App;