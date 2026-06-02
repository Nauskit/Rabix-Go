import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef(null);

    useEffect(() => {


        function handler(e) {
            if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    function handleLogout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        onLogout?.();
        setDropOpen(false);
        navigate("/");
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-[60px] bg-[#0a0a0f]/85 backdrop-blur-md border-b border-[#2a2a38]">
            {/* Logo */}
            <Link
                to="/"
                className="flex items-center gap-2 font-black text-lg tracking-tight no-underline text-[#f0f0f8]"
                style={{ fontFamily: "Syne, sans-serif" }}
            >
                <span className="w-2 h-2 rounded-full bg-[#e8ff47] animate-pulse" />
                Rabix GO<span className="text-[#e8ff47]">.</span>
            </Link>

            <div className="flex items-center gap-2">
                {user ? (
                    <>
                        {/* User dropdown */}
                        <div className="relative" ref={dropRef}>
                            <button
                                onClick={() => setDropOpen((v) => !v)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#13131a] border border-[#2a2a38] hover:border-[#3a3a48] transition-colors"
                            >
                                <div className="w-5 h-5 rounded-full bg-[#e8ff47] flex items-center justify-center text-[#0a0a0f] text-xs font-black">
                                    {user.username?.[0]?.toUpperCase() ?? "U"}
                                </div>
                                <span
                                    className="text-sm text-[#f0f0f8] font-medium max-w-[100px] truncate"
                                    style={{ fontFamily: "Syne, sans-serif" }}
                                >
                                    {user.username}
                                </span>
                                <svg
                                    className={`w-3 h-3 text-[#6b6b80] transition-transform ${dropOpen ? "rotate-180" : ""}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {dropOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-[#13131a] border border-[#2a2a38] rounded-xl overflow-hidden shadow-2xl shadow-black/60">
                                    <div className="px-4 py-3 border-b border-[#2a2a38]">
                                        <p className="text-[10px] text-[#6b6b80] uppercase tracking-widest font-medium">ล็อกอินเป็น</p>
                                        <p className="text-sm text-[#f0f0f8] font-bold truncate mt-0.5"
                                            style={{ fontFamily: "Syne, sans-serif" }}>
                                            {user.username}
                                        </p>
                                    </div>
                                    <Link
                                        to="/places"
                                        onClick={() => setDropOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#6b6b80] hover:text-[#f0f0f8] hover:bg-[#1c1c26] transition-colors no-underline"
                                    >
                                        🍽️&nbsp; ร้านอาหาร
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#ff4d6d] hover:bg-[#ff4d6d]/10 transition-colors text-left"
                                    >
                                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        ออกจากระบบ
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {pathname !== "/login" && (
                            <Link
                                to="/login"
                                className="px-4 py-1.5 rounded-lg border border-[#2a2a38] text-[#6b6b80] text-sm font-medium hover:text-white transition-colors no-underline"
                            >
                                Login
                            </Link>
                        )}
                        {pathname !== "/register" && (
                            <Link
                                to="/register"
                                className="px-4 py-1.5 rounded-lg bg-[#e8ff47] text-[#0a0a0f] text-sm font-bold hover:opacity-90 transition-opacity no-underline"
                            >
                                Register
                            </Link>
                        )}
                    </>
                )}
            </div>
        </nav>
    );
}