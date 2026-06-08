import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Places from "../pages/Places";
import Navbar from "../components/Navbar";
import PlaceDetail from "../pages/PlaceDetail";

function App() {
  // ── Global user state ──────────────────────────────────────
  // Reads from localStorage on mount so refresh doesn't log out
  const [user, setUser] = useState(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId")
    return username && token ? { username, id: userId } : null;
  });
  const [routes, setRoutes] = useState([]);



  //route patch
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('accessToken');
    fetch('http://localhost:3000/routes/showRoute', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => setRoutes(d.data ?? []));
  }, [user]);


  const handleAddToRoute = async (place, routeId) => {
    const token = localStorage.getItem('accessToken');
    await fetch(`http://localhost:3000/routes/${routeId}/places`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ placeId: place.id })
    });
    setRoutes(prev => prev.map(r =>
      r.id === routeId
        ? { ...r, place_count: (r.place_count ?? 0) + 1 }
        : r
    ));
  };
  // Sync user state if Login page sets localStorage directly
  // (Login.jsx ต้อง dispatch event "auth" หลัง setItem — ดูด้านล่าง)
  useEffect(() => {
    function onAuth() {
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      setUser(username && token ? { username, id: userId } : null);
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
        <Route path="/places" element={
          <Places
            user={user}
            routes={routes}
            setRoutes={setRoutes}
            onAddToPlaylist={handleAddToRoute}
          />} />
        <Route path="/places/:id" element={<PlaceDetail
          user={user}
          routes={routes}
          onAddToPlaylist={handleAddToRoute}
        />} />
      </Routes>
    </div>
  );
}

export default App;