import { useState } from "react";
import { Link } from "react-router-dom";

const PRICE_COLOR = {
    "฿": "text-[#e8ff47]",
    "฿฿": "text-[#e8ff47]/80",
    "฿฿฿": "text-[#7c6bff]",
    "฿฿฿฿": "text-[#ff4d6d]",
};

function Stars({ rating }) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <svg
                    key={s}
                    className={`w-3 h-3 ${s <= full ? "text-[#e8ff47]" : s === full + 1 && half ? "text-[#e8ff47]/50" : "text-[#2a2a38]"}`}
                    viewBox="0 0 20 20" fill="currentColor"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

export default function PlaceCard({ place, isOwner }) {
    const [imgErr, setImgErr] = useState(false);
    const coverImage = place.images?.[0] ?? null;
    return (
        <Link to={`/places/${place.id}`} className="block no-underline">  {/* ← เพิ่ม */}
            <div className="group bg-[#13131a] border border-[#2a2a38] rounded-xl overflow-hidden hover:border-[#7c6bff] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
                {/* Image */}
                <div className="relative h-44 bg-[#1c1c26] overflow-hidden">
                    {!imgErr && coverImage ? (
                        <img
                            src={coverImage}
                            alt={place.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                            onError={() => setImgErr(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">🍽️</div>
                    )}

                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13131a]/80 via-transparent to-transparent" />

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                        <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm border ${place.is_open
                                ? "bg-[#e8ff47]/15 border-[#e8ff47]/30 text-[#e8ff47]"
                                : "bg-[#6b6b80]/15 border-[#6b6b80]/30 text-[#6b6b80]"
                                }`}
                        >
                            {place.is_open ? "● เปิดอยู่" : "○ ปิดแล้ว"}
                        </span>
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full bg-[#0a0a0f]/80 backdrop-blur-sm ${PRICE_COLOR[place.priceRange] ?? "text-[#6b6b80]"}`}>
                            {place.priceRange}
                        </span>
                    </div>

                    {/* Owner badge */}
                    {isOwner && (
                        <div className="absolute bottom-3 left-3">
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#7c6bff]/20 border border-[#7c6bff]/40 text-[#7c6bff]">
                                ✦ ร้านของฉัน
                            </span>
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className="p-4">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-[#7c6bff] uppercase tracking-widest">
                            {place.place_type}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <Stars rating={place.avg_rating ?? 0} />
                            <span className="text-xs font-bold text-[#f0f0f8]">{place.avg_rating ?? "—"}</span>
                            <span className="text-[10px] text-[#6b6b80]">({place.review_count ?? 0})</span>
                        </div>
                    </div>
                    {place.top_tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {place.top_tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[#1c1c26] border border-[#2a2a38] text-[#6b6b80]">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <h3
                        className="font-black text-base text-[#f0f0f8] mb-1.5 group-hover:text-[#e8ff47] transition-colors line-clamp-1"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        {place.name}
                    </h3>

                    <p className="text-xs text-[#6b6b80] leading-relaxed line-clamp-2 mb-3">
                        {place.description}
                    </p>


                    <div className="flex items-center gap-1.5 text-[11px] text-[#3a3a48]">
                        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{place.address}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}