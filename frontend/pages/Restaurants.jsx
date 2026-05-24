import { useState, useEffect } from "react";
import RestaurantCard from "../components/RestaurantCard.jsx";
import CreateRestaurantModal from "../components/CreateRestaurantModal.jsx";

// ── Mock fallback ──────────────────────────────────────────────────────
const MOCK = [
    { id: 1, name: "ครัวคุณแม่", description: "อาหารไทยโฮมเมดรสชาติต้นตำรับ ทำสดใหม่ทุกวัน ใช้วัตถุดิบคัดสรรจากตลาด", category: "อาหารไทย", rating: 4.8, reviewCount: 128, imageUrl: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=600&q=80", address: "ถ.สุขุมวิท กรุงเทพฯ", isOpen: true, priceRange: "฿฿", ownerId: "demo" },
    { id: 2, name: "Tokyo Ramen House", description: "ราเมนสไตล์ญี่ปุ่นแท้ น้ำซุปเคี่ยว 18 ชั่วโมง สูตรพิเศษจาก Osaka", category: "อาหารญี่ปุ่น", rating: 4.6, reviewCount: 95, imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80", address: "ถ.สีลม กรุงเทพฯ", isOpen: true, priceRange: "฿฿฿", ownerId: "other" },
    { id: 3, name: "The Burger Lab", description: "Craft burger เนื้อแท้ 100% ชีสเยิ้ม ท็อปปิ้งไม่อั้น", category: "อาหารตะวันตก", rating: 4.5, reviewCount: 73, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80", address: "ถ.เอกมัย กรุงเทพฯ", isOpen: false, priceRange: "฿฿", ownerId: "other" },
    { id: 4, name: "Green Bowl", description: "Healthy bowl สลัดสดใหม่ superfood คาโลรี่ต่ำ อิ่มได้ทุกวัน", category: "เพื่อสุขภาพ", rating: 4.7, reviewCount: 210, imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80", address: "ถ.ทองหล่อ กรุงเทพฯ", isOpen: true, priceRange: "฿฿", ownerId: "demo" },
    { id: 5, name: "Dimsum Palace", description: "ติ่มซำทำมือทุกชิ้น สดใหม่จากเตา หอมกรุ่น เปิดตั้งแต่เช้า", category: "อาหารจีน", rating: 4.9, reviewCount: 340, imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80", address: "เยาวราช กรุงเทพฯ", isOpen: true, priceRange: "฿", ownerId: "other" },
    { id: 6, name: "Pasta Felice", description: "พาสต้าสดทำมือ ซอสโฮมเมด วัตถุดิบนำเข้าจากอิตาลีแท้", category: "อาหารอิตาลี", rating: 4.6, reviewCount: 88, imageUrl: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", address: "ถ.อารีย์ กรุงเทพฯ", isOpen: true, priceRange: "฿฿฿", ownerId: "other" },
];

const ALL_CATS = ["ทั้งหมด", "อาหารไทย", "อาหารญี่ปุ่น", "อาหารตะวันตก", "อาหารจีน", "อาหารอิตาลี", "เพื่อสุขภาพ"];

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
export default function Restaurants({ user }) {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("ทั้งหมด");
    const [showModal, setShowModal] = useState(false);

    // Fetch restaurants
    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        fetch("http://localhost:3000/restaurants", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
            .then((r) => r.json())
            .then((d) => setRestaurants(Array.isArray(d) ? d : MOCK))
            .catch(() => setRestaurants(MOCK))
            .finally(() => setLoading(false));
    }, []);

    function handleCreated(r) {
        setRestaurants((prev) => [r, ...prev]);
        setShowModal(false);
    }

    // Filter
    const filtered = restaurants.filter((r) => {
        const matchCat = activeTab === "ทั้งหมด" || r.category === activeTab;
        const q = search.toLowerCase();
        const matchSearch = !q || r.name.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q);
        return matchCat && matchSearch;
    });

    const openCount = filtered.filter((r) => r.isOpen).length;

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
                    {loading ? "กำลังโหลด..." : `${restaurants.length} ร้านในระบบ`}
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
                <div className="max-w-5xl mx-auto px-4 flex items-center justify-between gap-4 py-3">
                    {/* Tabs — scrollable */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
                        {ALL_CATS.map((cat) => (
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

                    {/* Add restaurant button (logged-in only) */}
                    {user && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#7c6bff]/20 border border-[#7c6bff]/40 text-[#7c6bff] text-xs font-bold hover:bg-[#7c6bff]/30 transition-colors"
                        >
                            <span className="text-sm leading-none">＋</span>
                            เพิ่มร้าน
                        </button>
                    )}
                </div>
            </div>

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
                                <RestaurantCard
                                    restaurant={r}
                                    isOwner={user?.username === r.ownerId || user?.username === r.owner}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA for guests */}
                {!user && !loading && restaurants.length > 0 && (
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
                <CreateRestaurantModal
                    onClose={() => setShowModal(false)}
                    onCreated={handleCreated}
                />
            )}
        </div>
    );
}