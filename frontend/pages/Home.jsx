import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FEATURES = [
    { icon: "⚡", title: "Realtime WebSocket", desc: "อัปเดตสถานะออเดอร์แบบ real-time ด้วย WebSocket + Redis pub/sub" },
    { icon: "🔐", title: "JWT Authentication", desc: "ระบบ auth ที่ปลอดภัยด้วย JWT + refresh token" },
    { icon: "⭐", title: "Rating & Ranking", desc: "ระบบรีวิวและจัดอันดับร้านค้าแบบ weighted score" },
    { icon: "🚀", title: "High Scalability", desc: "รองรับ load สูงด้วย rate limiting และ caching layer" },
];

const STATS = [
    { val: "100k+", label: "Concurrent Users" },
    { val: "<50ms", label: "Realtime Latency" },
    { val: "99.9%", label: "Uptime SLA" },
];



export default function Home() {
    const [token, setToken] = useState(null);
    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        setToken(storedToken);
    }, []);

    return (
        <div className="min-h-screen pt-[60px]">
            {/* ── Hero ── */}
            <section className="relative flex flex-col items-center text-center px-4 pt-24 pb-20">
                {/* purple glow */}
                <div
                    className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
                    style={{ background: "radial-gradient(ellipse, rgba(124,107,255,0.15) 0%, transparent 70%)" }}
                />
                <div className="inline-flex items-center gap-2 bg-[#1c1c26] border border-[#2a2a38] rounded-full px-3.5 py-1.5 text-xs text-[#6b6b80] mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e8ff47] animate-pulse" />
                    Realtime Order Management System
                </div>

                <h1
                    className="font-black text-5xl md:text-6xl leading-tight tracking-tighter max-w-2xl mb-6"
                    style={{ fontFamily: "Syne, sans-serif" }}
                >
                    Rabix
                    <span className="text-[#e8ff47]"> Go</span>
                </h1>

                <p className="text-[#6b6b80] text-base max-w-md leading-relaxed mb-10">
                    ระบบจัดการ One day tip ด้วยการสร้าง Route
                </p>

                <div className="flex gap-3 flex-wrap justify-center">
                    <Link
                        to="/places"
                        className="px-7 py-3.5 bg-[#e8ff47] text-[#0a0a0f] rounded-xl text-sm font-bold hover:-translate-y-0.5 transition-transform no-underline"
                    >
                        เริ่มใช้งาน →
                    </Link>
                    {!token && (
                        <Link
                            to="/login"
                            className="px-7 py-3.5 bg-[#13131a] border border-[#2a2a38] text-[#f0f0f8] rounded-xl text-sm font-medium hover:border-[#3a3a48] transition-colors no-underline"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </section>

            {/* ── Stats ── */}
            <div className="grid grid-cols-3 divide-x divide-[#2a2a38] border-y border-[#2a2a38] max-w-2xl mx-4 md:mx-auto rounded-xl overflow-hidden">
                {STATS.map((s) => (
                    <div key={s.val} className="bg-[#13131a] py-8 text-center">
                        <div
                            className="text-3xl font-black text-[#e8ff47] tracking-tight"
                            style={{ fontFamily: "Syne, sans-serif" }}
                        >
                            {s.val}
                        </div>
                        <div className="text-xs text-[#6b6b80] mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Features ── */}
            <section className="max-w-3xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {FEATURES.map((f) => (
                        <div
                            key={f.title}
                            className="bg-[#13131a] border border-[#2a2a38] rounded-xl p-5 hover:border-[#7c6bff] transition-colors"
                        >
                            <div className="text-2xl mb-3">{f.icon}</div>
                            <div className="font-bold text-sm mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                                {f.title}
                            </div>
                            <div className="text-[#6b6b80] text-xs leading-relaxed">{f.desc}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}