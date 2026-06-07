import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Stars ──────────────────────────────────────────────────────────────
function Stars({ rating, size = "sm" }) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const s = size === "lg" ? "w-4 h-4" : "w-3 h-3";
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <svg key={n} className={`${s} ${n <= full ? "text-[#e8ff47]" : n === full + 1 && half ? "text-[#e8ff47]/50" : "text-[#2a2a38]"}`} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

// ── Rating Bar ─────────────────────────────────────────────────────────
function RatingBar({ label, pct }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#6b6b80] w-4 shrink-0">{label}</span>
            <div className="flex-1 h-1.5 bg-[#1c1c26] rounded-full overflow-hidden">
                <div className="h-full bg-[#e8ff47] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[10px] text-[#6b6b80] w-6 text-right">{pct}%</span>
        </div>
    );
}

// ── Main ───────────────────────────────────────────────────────────────
export default function PlaceDetail({ onBack, user, routes, onAddToPlaylist }) {
    const [place, setPlace] = useState(null);
    const [tags, setTags] = useState([]);
    const [selectTags, setSelectTag] = useState([])
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [tab, setTab] = useState("info"); // info | reviews
    const [saved, setSaved] = useState(false);
    const [addedToRoute, setAddedToRoute] = useState(false);
    const [showRouteSelect, setShowRouteSelect] = useState(false);
    const [rating, setRating] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchPlaceDetail = async () => {
            try {
                setLoading(true);
                const [placeRes, tagsRes] = await Promise.all([
                    fetch(`http://localhost:3000/places/${id}`),
                    fetch('http://localhost:3000/tags')
                ]);
                const placeData = await placeRes.json();
                const tagsData = await tagsRes.json();
                setPlace(placeData.data);
                setTags(tagsData.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlaceDetail();
    }, [id])

    //toggle tags
    const toggleTag = (tagId) => {
        setSelectTag(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        )
    }

    const handleRatingClick = (value) => {
        if (rating === value) {
            setRating(null);
        } else {
            setRating(value);
        }
    }


    if (loading) return <DetailSkeleton />;
    if (!place || !tags) return null;

    const PRICE_COLOR = { "฿": "text-[#e8ff47]", "฿฿": "text-[#e8ff47]/80", "฿฿฿": "text-[#7c6bff]", "฿฿฿฿": "text-[#ff4d6d]" };




    return (
        <div className="min-h-screen pt-[60px] bg-[#0a0a0f]">
            {/* ── Back Button ─────────────────────────────────────────────── */}
            <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-[#6b6b80] hover:text-[#f0f0f8] text-sm transition-colors group"
                >
                    <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <Link to={'/places'}>
                        กลับไปหน้าร้านอาหาร
                    </Link>
                </button>
            </div>

            <div className="max-w-4xl mx-auto px-4 pb-20">
                {/* ── Image Gallery ────────────────────────────────────────── */}
                <div className="mt-4 rounded-2xl overflow-hidden border border-[#2a2a38] relative">
                    <div className="relative h-72 md:h-96 bg-[#1c1c26]">
                        <img
                            src={place.images?.[activeImg] ?? place.images}
                            alt={place.name}
                            className="w-full h-full object-cover opacity-90 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-transparent" />

                        {/* Status + Price */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className={`text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-sm border ${place.is_open ? "bg-[#e8ff47]/15 border-[#e8ff47]/30 text-[#e8ff47]" : "bg-[#6b6b80]/15 border-[#6b6b80]/30 text-[#6b6b80]"}`}>
                                {place.is_open ? "● เปิดอยู่" : "○ ปิดแล้ว"}
                            </span>
                            <span className={`text-xs font-black px-3 py-1 rounded-full bg-[#0a0a0f]/70 backdrop-blur-sm ${PRICE_COLOR[place.priceRange] ?? "text-[#6b6b80]"}`}>
                                {place.price_min} - {place.price_max} ฿
                            </span>
                        </div>

                        {/* Action buttons */}
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button
                                onClick={() => setSaved(!saved)}
                                className={`w-9 h-9 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all ${saved ? "bg-[#ff4d6d]/20 border-[#ff4d6d]/40 text-[#ff4d6d]" : "bg-[#0a0a0f]/60 border-[#2a2a38] text-[#6b6b80] hover:text-white"}`}
                            >
                                <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Thumbnail dots */}
                        {place.images?.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {place.images.map((_, i) => (
                                    <button key={i} onClick={() => setActiveImg(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeImg ? "bg-[#e8ff47] w-4" : "bg-[#6b6b80]/60"}`} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Thumbnail strip */}
                    {place.images?.length > 1 && (
                        <div className="flex gap-2 p-3 bg-[#13131a]">
                            {place.images.map((img, i) => (
                                <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${i === activeImg ? "border-[#e8ff47]" : "border-transparent opacity-50 hover:opacity-80"}`}>
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Header Info ──────────────────────────────────────────── */}
                <div className="mt-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                        <span className="text-[11px] font-bold text-[#7c6bff] uppercase tracking-widest">{place.category}</span>
                        <h1 className="font-black text-3xl text-[#f0f0f8] mt-1 leading-tight" style={{ fontFamily: "Syne, sans-serif" }}>
                            {place.name}
                        </h1>
                        <div className="flex items-center gap-3 mt-2">
                            <Stars rating={place.avg_rating} size="lg" />
                            <span className="text-sm font-bold text-[#f0f0f8]">{place.avg_rating}</span>
                            <span className="text-xs text-[#6b6b80]">({place.review_count} รีวิว)</span>
                        </div>
                    </div>

                    {/* Add to Route CTA */}
                    <div className="relative shrink-0">
                        <button
                            onClick={() => setShowRouteSelect(prev => !prev)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-[#e8ff47] text-[#0a0a0f] hover:opacity-90 transition-all"
                        >
                            🔖 เพิ่มใน Route
                        </button>

                        {showRouteSelect && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-[#13131a] border border-[#2a2a38] rounded-xl shadow-xl z-50 overflow-hidden">
                                <div className="px-4 py-2.5 border-b border-[#2a2a38]">
                                    <p className="text-[11px] font-bold text-[#6b6b80] uppercase tracking-widest">
                                        เลือก Route
                                    </p>
                                </div>

                                {routes?.length === 0 ? (
                                    <p className="text-xs text-[#6b6b80] text-center py-4 px-3">
                                        ยังไม่มี Route — ไปสร้างที่หน้าร้านก่อน
                                    </p>
                                ) : (
                                    routes?.map(route => (
                                        <button
                                            key={route.id}
                                            onClick={async () => {
                                                await onAddToPlaylist(place, route.id);
                                                setShowRouteSelect(false);
                                                setAddedToRoute(true);
                                            }}
                                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#1c1c26] transition-colors text-left"
                                        >
                                            <div>
                                                <p className="text-sm font-bold text-[#f0f0f8]">{route.name}</p>
                                                <p className="text-[10px] text-[#6b6b80]">
                                                    {route.place_count ?? 0} สถานที่
                                                </p>
                                            </div>
                                            <span className="text-[#7c6bff] text-lg font-black">+</span>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {place.top_tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {place.top_tags?.map((tag) => (
                                <span key={tag} className="text-[11px] px-3 py-1 rounded-full bg-[#1c1c26] border border-[#2a2a38] text-[#6b6b80] cursor-pointer transition-all hover:border-[#7c6bff] hover:text-[#f0f0f8] hover:bg-[#7c6bff]/10">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                {/* ── Tabs ─────────────────────────────────────────────────── */}
                <div className="flex gap-1 mt-8 bg-[#13131a] border border-[#2a2a38] rounded-xl p-1">
                    {[{ key: "info", label: "ข้อมูลร้าน" }, { key: "reviews", label: `รีวิว (${place.review_count})` }].map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${tab === t.key ? "bg-[#7c6bff] text-white" : "text-[#6b6b80] hover:text-[#f0f0f8]"}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ── TAB: Info ────────────────────────────────────────────── */}
                {tab === "info" && (
                    <div className="mt-6 space-y-4">
                        {/* Description */}
                        <div className="bg-[#13131a] border border-[#2a2a38] rounded-xl p-5">
                            <h2 className="text-xs font-bold text-[#6b6b80] uppercase tracking-widest mb-3">เกี่ยวกับร้าน</h2>
                            <p className="text-sm text-[#c0c0d0] leading-relaxed">{place.description}</p>
                        </div>

                        {/* Info grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Contact */}
                            <div className="bg-[#13131a] border border-[#2a2a38] rounded-xl p-5 space-y-3">
                                <h2 className="text-xs font-bold text-[#6b6b80] uppercase tracking-widest">ติดต่อ & ที่ตั้ง</h2>
                                <div className="flex items-start gap-3 text-sm text-[#c0c0d0]">
                                    <svg className="w-4 h-4 shrink-0 mt-0.5 text-[#7c6bff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{place.address}</span>
                                </div>
                                {place.phone && (
                                    <div className="flex items-center gap-3 text-sm text-[#c0c0d0]">
                                        <svg className="w-4 h-4 shrink-0 text-[#7c6bff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span>{place.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-sm text-[#c0c0d0]">
                                    <svg className="w-4 h-4 shrink-0 text-[#7c6bff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>ราคาเฉลี่ย {place.avgPrice ? `฿${place.avgPrice}/คน` : place.priceRange}</span>
                                </div>
                            </div>

                            {/* Hours */}
                            <div className="bg-[#13131a] border border-[#2a2a38] rounded-xl p-5 space-y-3">
                                <h2 className="text-xs font-bold text-[#6b6b80] uppercase tracking-widest">เวลาเปิด-ปิด</h2>
                                {place.hours?.map((h, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-[#6b6b80]">{h.day}</span>
                                        {h.closed
                                            ? <span className="text-[#ff4d6d] text-xs font-bold">หยุด</span>
                                            : <span className="text-[#e8ff47] font-bold">{h.open} – {h.close}</span>
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Map placeholder */}
                        <div className="bg-[#13131a] border border-[#2a2a38] rounded-xl overflow-hidden">
                            {place.latitude && place.longitude ? (
                                <MapContainer
                                    center={[place.latitude, place.longitude]}
                                    zoom={15}
                                    style={{ height: "240px", width: "100%" }}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer
                                        attribution='&copy; OpenStreetMap'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[place.latitude, place.longitude]}>
                                        <Popup>{place.name}</Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                // fallback ถ้าไม่มี lat/lng
                                <div className="h-40 bg-[#1c1c26] flex items-center justify-center">
                                    <p className="text-xs text-[#6b6b80]">ไม่มีข้อมูลแผนที่</p>
                                </div>
                            )}
                            <div className="p-4">
                                <p className="text-xs text-[#6b6b80] truncate">{place.address}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB: Reviews ─────────────────────────────────────────── */}
                {tab === "reviews" && (
                    <div className="mt-6 space-y-4">
                        {/* Rating summary */}
                        <div className="bg-[#13131a] border border-[#2a2a38] rounded-xl p-5 flex gap-6">
                            <div className="text-center shrink-0">
                                <div className="font-black text-5xl text-[#e8ff47]" style={{ fontFamily: "Syne, sans-serif" }}>{place.rating}</div>
                                <Stars rating={place.avg_rating} size="lg" />
                                <p className="text-[11px] text-[#6b6b80] mt-1">{place.review_count} รีวิว</p>
                            </div>
                            <div className="flex-1 space-y-2 justify-center flex flex-col">
                                <RatingBar label="5" pct={0} />
                                <RatingBar label="4" pct={0} />
                                <RatingBar label="3" pct={0} />
                                <RatingBar label="2" pct={0} />
                                <RatingBar label="1" pct={0} />
                            </div>
                        </div>

                        {/* Write review */}
                        {user && (
                            <div className="bg-[#13131a] border border-[#2a2a38] rounded-xl p-5">
                                <h3 className="text-sm font-bold text-[#f0f0f8] mb-3">เขียนรีวิว</h3>
                                <div className="flex gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleRatingClick(s)}
                                            className={`w-8 h-8 transition-colors ${s <= rating ? "text-[#e8ff47]" : "text-[#2a2a38]"}`}>
                                            <svg viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    placeholder="แชร์ประสบการณ์ของคุณ..."
                                    rows={3}
                                    className="w-full bg-[#0a0a0f] border border-[#2a2a38] focus:border-[#7c6bff] rounded-xl p-3 text-sm text-[#f0f0f8] placeholder:text-[#3a3a48] outline-none resize-none transition-colors"
                                />
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {tags.map(tag => (
                                        <button
                                            key={tag.id}
                                            onClick={() => toggleTag(tag.id)}
                                            className={`text-[11px] px-3 py-1.5 rounded-full border transition-all font-medium ${selectTags.includes(tag.id)
                                                ? "bg-[#7c6bff] border-[#7c6bff] text-white"
                                                : "bg-[#0a0a0f] border-[#2a2a38] text-[#6b6b80] hover:border-[#7c6bff] hover:text-[#f0f0f8]"
                                                }`}>
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-end mt-2">
                                    <button className="px-4 py-2 rounded-lg bg-[#7c6bff] text-white text-sm font-bold hover:opacity-90 transition-opacity">
                                        ส่งรีวิว
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Review list */}
                        <div className="space-y-3">
                            {place.reviews?.map((rv) => (
                                <div key={rv.id} className="bg-[#13131a] border border-[#2a2a38] rounded-xl p-5">

                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">

                                            {/* Avatar */}
                                            <div className="w-8 h-8 rounded-full bg-[#7c6bff]/20 border border-[#7c6bff]/30 flex items-center justify-center text-sm font-bold text-[#7c6bff]">
                                                {rv.username
                                                    ? rv.username[0].toUpperCase()
                                                    : rv.avatar ?? "?"}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#f0f0f8]">
                                                    {rv.username ?? "ผู้ใช้ไม่ระบุชื่อ"}
                                                </p>
                                                <p className="text-[10px] text-[#6b6b80]">
                                                    {new Date(rv.created_at).toLocaleDateString('th-TH')}
                                                </p>
                                            </div>
                                        </div>
                                        <Stars rating={rv.rating} />
                                    </div>
                                    {/* comment */}
                                    <p className="text-sm text-[#c0c0d0] leading-relaxed">
                                        {rv.comment ? rv.comment : `มีการให้คะแนน ${rv.rating} คะแนน`}
                                    </p>

                                    {/* Tags */}
                                    {rv.tags?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {rv.tags.map((tag) => (
                                                <span key={tag} className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#1c1c26] border border-[#2a2a38] text-[#6b6b80]">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {!rv.comment && rv.tags?.length > 0 && (
                                        <p className="text-[11px] text-[#6b6b80] mt-2">
                                            vote tag: {rv.tags.join(", ")}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Skeleton ───────────────────────────────────────────────────────────
function DetailSkeleton() {
    return (
        <div className="min-h-screen pt-[60px] bg-[#0a0a0f] animate-pulse">
            <div className="max-w-4xl mx-auto px-4 pt-6 pb-20">
                <div className="h-3 w-32 bg-[#1c1c26] rounded mb-4" />
                <div className="h-72 bg-[#13131a] rounded-2xl border border-[#2a2a38] mb-6" />
                <div className="h-6 w-48 bg-[#1c1c26] rounded mb-2" />
                <div className="h-8 w-64 bg-[#1c1c26] rounded mb-4" />
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-40 bg-[#13131a] rounded-xl border border-[#2a2a38]" />
                    <div className="h-40 bg-[#13131a] rounded-xl border border-[#2a2a38]" />
                </div>
            </div>
        </div>
    );
}