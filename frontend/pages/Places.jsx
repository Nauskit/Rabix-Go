import { useState, useEffect } from "react";
import PlaceCard from "../components/PlaceCard.jsx";
import CreatePlaceModel from "../components/CreatePlaceModel.jsx";


const CATEGORIES = {
    "ร้านอาหาร": ["ทั้งหมด", "อาหารไทย", "อาหารญี่ปุ่น", "อาหารตะวันตก", "อาหารจีน", "อาหารอิตาลี", "ร้านคาเฟ่", "เพื่อสุขภาพ"],
    "สถานที่ท่องเที่ยว": ["ทั้งหมด", "ทะเล", "ภูเขา", "วัด", "ธรรมชาติ", "ช้อปปิ้ง"],
    "ร้านของฉัน": ["ทั้งหมด"]
};

// ── Skeleton ───────────────────────────────────────────────────────────
function Skeleton() {
    return (
        <div className="bg-[#13131a] border border-[#2a2a38] rounded-xl overflow-hidden animate-pulse">
            <div className="h-44 bg-[#1c1c26]" />
            <div className="p-4 space-y-2.5">
                <div className="h-2.5 bg-[#1c1c26] rounded w-1/4" />
                <div className="h-4 bg-[#1c1c26] rounded w-2/3" />
                <div className="h-2.5 bg-[#1c1c26] rounded w-full" />
                <div className="h-2.5 bg-[#1c1c26] rounded w-4/5" />
            </div>
        </div>
    );
}

// ── Main ───────────────────────────────────────────────────────────────
export default function Places({ user }) {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeGroup, setActiveGroup] = useState("ร้านอาหาร");
    const [activeTab, setActiveTab] = useState("ทั้งหมด");
    const [showModal, setShowModal] = useState(false);
    const [showRoutePanel, setShowRoutePanel] = useState(false);

    // Fetch restaurants
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("accessToken");
                const res = await fetch("http://localhost:3000/places?page=1&limit=12", {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                const d = await res.json();
                setPlaces(Array.isArray(d.data) ? d.data : []);

            } catch (error) {
                setPlaces([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPlaces();
    }, []);
    function handleCreated(r) {
        setPlaces((prev) => [r, ...prev]);
        setShowModal(false);
    }

    // Filter
    const filtered = places.filter((r) => {
        const matchCat = activeTab === "ทั้งหมด" || r.category === activeTab;
        const q = search.toLowerCase();
        const matchSearch = !q || r.name.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q);
        return matchCat && matchSearch;
    });

    const openCount = filtered.filter((r) => r.is_open).length;


    return (
        <div className="min-h-screen pt-[60px]">
            {/* ── Hero / Header ─────────────────────────────────────── */}
            <section className="relative flex flex-col items-center text-center px-4 pt-16 pb-12">
                {/* glow */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
                    style={{ background: "radial-gradient(ellipse, rgba(124,107,255,0.12) 0%, transparent 70%)" }}
                />

                <div className="inline-flex items-center gap-2 bg-[#1c1c26] border border-[#2a2a38] rounded-full px-3.5 py-1.5 text-xs text-[#6b6b80] mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e8ff47] animate-pulse" />
                    {loading ? "กำลังโหลด..." : `${places.length} ร้านในระบบ`}
                </div>

                <h1
                    className="font-black text-4xl md:text-5xl leading-tight tracking-tighter max-w-xl mb-4"
                    style={{ fontFamily: "Syne, sans-serif" }}
                >
                    ร้านอาหาร<br />
                    <span className="text-[#e8ff47]">ทั้งหมด</span>
                </h1>

                <p className="text-[#6b6b80] text-sm max-w-sm leading-relaxed mb-8">
                    รวมร้านอาหารจากผู้ขายในระบบ พร้อมรีวิวและคะแนนจากผู้ใช้จริง
                </p>

                {/* Search */}
                <div className="relative w-full max-w-md">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3a3a48] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="ค้นหาร้านอาหาร..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#13131a] border border-[#2a2a38] focus:border-[#7c6bff] rounded-xl pl-10 pr-10 py-3 text-sm text-[#f0f0f8] placeholder:text-[#3a3a48] outline-none transition-colors"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3a3a48] hover:text-[#6b6b80] transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </section>

            {/* ── Category tabs + action bar ────────────────────────── */}
            <div className="sticky top-[60px] z-30 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-[#2a2a38]">
                <div className="max-w-5xl mx-auto px-4 py-3 space-y-2">

                    {/* แถวที่ 1 — Group + ปุ่ม action */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            {Object.keys(CATEGORIES).map((group) => (
                                <button
                                    key={group}
                                    onClick={() => { setActiveGroup(group); setActiveTab("ทั้งหมด"); }}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeGroup === group
                                        ? "bg-[#7c6bff] text-white"
                                        : "text-[#6b6b80] hover:text-[#f0f0f8]"
                                        }`}
                                >
                                    {group} ›
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowRoutePanel(prev => !prev)}
                                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#7c6bff]/20 border border-[#7c6bff]/40 text-[#7c6bff] text-xs font-bold hover:bg-[#7c6bff]/30 transition-colors"
                            >
                                <span className="text-sm leading-none">🗺️</span>
                                Route
                            </button>
                            {user && (
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#7c6bff]/20 border border-[#7c6bff]/40 text-[#7c6bff] text-xs font-bold hover:bg-[#7c6bff]/30 transition-colors"
                                >
                                    <span className="text-sm leading-none">＋</span>
                                    เพิ่มร้าน
                                </button>
                            )}
                        </div>
                    </div>

                    {/* แถวที่ 2 — Sub tabs */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {CATEGORIES[activeGroup].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 ${activeTab === cat
                                    ? "bg-[#e8ff47] text-[#0a0a0f]"
                                    : "bg-[#13131a] border border-[#2a2a38] text-[#6b6b80] hover:border-[#3a3a48] hover:text-[#f0f0f8]"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                </div>
            </div>
            {showRoutePanel && (
                <div className="border-t border-[#2a2a38] bg-[#0d0d14]">
                    <div className="max-w-5xl mx-auto px-4 py-4">
                        <p className="text-xs font-bold text-[#f0f0f8] mb-3">Routes ของฉัน</p>
                        <p className="text-xs text-[#6b6b80] text-center py-4">
                            ยังไม่มี route — สร้างอันแรกได้เลย
                        </p>
                        <div className="flex gap-2 pt-2">
                            <input
                                placeholder="ชื่อ route ใหม่..."
                                className="flex-1 bg-[#0a0a0f] border border-[#2a2a38] focus:border-[#7c6bff] rounded-xl px-3 py-2 text-xs text-[#f0f0f8] placeholder:text-[#3a3a48] outline-none transition-colors"
                            />
                            <button className="px-4 py-2 rounded-xl bg-[#7c6bff] text-white text-xs font-bold">
                                สร้าง
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Grid ──────────────────────────────────────────────── */}
            <main className="max-w-5xl mx-auto px-4 py-10 pb-20">
                {/* Section meta */}
                {!loading && (
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-sm font-bold text-[#f0f0f8]">
                                {activeTab === "ทั้งหมด" ? "ร้านอาหารทั้งหมด" : activeTab}
                            </p>
                            <p className="text-xs text-[#6b6b80] mt-0.5">
                                {filtered.length} ร้าน ·{" "}
                                <span className="text-[#e8ff47]">{openCount} เปิดอยู่</span>
                            </p>
                        </div>
                    </div>
                )}

                {/* Skeleton */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => <Skeleton key={i} />)}
                    </div>
                )}

                {/* Empty */}
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-24">
                        <div className="text-5xl mb-4 opacity-30">🍽️</div>
                        <p className="text-[#6b6b80] text-sm mb-6">
                            {search ? "ไม่พบร้านที่ตรงกับการค้นหา" : "ยังไม่มีร้านในหมวดนี้"}
                        </p>
                        {user && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-6 py-2.5 rounded-lg bg-[#e8ff47] text-[#0a0a0f] text-sm font-bold hover:opacity-90 transition-opacity"
                            >
                                ✦ เพิ่มร้านแรก
                            </button>
                        )}
                    </div>
                )}

                {/* Cards */}
                {!loading && filtered.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((r, i) => (
                            <div
                                key={r.id}
                                className="opacity-0 animate-[fadeUp_0.4s_ease_forwards]"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <PlaceCard
                                    place={r}
                                    isOwner={user?.username === r.ownerId || user?.username === r.owner}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA for guests */}
                {!user && !loading && places.length > 0 && (
                    <div className="mt-16 bg-[#13131a] border border-[#2a2a38] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
                        <div>
                            <p
                                className="font-black text-base text-[#f0f0f8] mb-1"
                                style={{ fontFamily: "Syne, sans-serif" }}
                            >
                                มีร้านอาหารของตัวเอง?
                            </p>
                            <p className="text-xs text-[#6b6b80]">Login แล้วเพิ่มร้านของคุณในระบบได้เลย</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <a
                                href="/login"
                                className="px-4 py-2 rounded-lg border border-[#2a2a38] text-[#6b6b80] text-sm font-medium hover:text-white transition-colors no-underline"
                            >
                                Login
                            </a>
                            <a
                                href="/register"
                                className="px-4 py-2 rounded-lg bg-[#e8ff47] text-[#0a0a0f] text-sm font-bold hover:opacity-90 transition-opacity no-underline"
                            >
                                Register
                            </a>
                        </div>
                    </div>
                )}
            </main>

            {/* Modal */}
            {showModal && user && (
                <CreatePlaceModel
                    onClose={() => setShowModal(false)}
                    onCreated={handleCreated}
                />
            )}
        </div>
    );
}