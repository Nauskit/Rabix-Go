import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const { pathname } = useLocation();

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

            {/* Actions */}
            <div className="flex gap-2">
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
            </div>
        </nav>
    );
}