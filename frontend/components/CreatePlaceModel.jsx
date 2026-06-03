import { useState, useEffect } from "react";
import { Input, Btn, ErrorAlert } from "./FormElements.jsx";
import geography from '../src/data/geography.json'


const CATEGORIES = ["ร้านอาหาร", "ร้านคาเฟ่", "สถานที่ท่องเที่ยว"];
export default function CreatePlaceModel({ onClose, onCreated }) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        place_type: "ร้านอาหาร",
        address: "",
        province: "",
        district: "",
        subdistrict: "",
        priceRange: "100-250฿",
        image_url: "",
    });

    const PRICE_MAP = {
        "100-250฿": { price_min: 100, price_max: 250 },
        "200-500฿": { price_min: 200, price_max: 500 },
        "400-800฿": { price_min: 400, price_max: 800 },
        "500-1000+฿": { price_min: 500, price_max: 1000 },
    }


    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    // Close on Escape
    useEffect(() => {
        const fn = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", fn);
        return () => window.removeEventListener("keydown", fn);
    }, [onClose]);

    const set = (key) => (e) => {
        setForm((f) => ({ ...f, [key]: e.target.value }));
        setError("");
    };

    async function handleSubmit() {
        if (!form.name.trim()) { setError("กรุณากรอกชื่อร้าน"); return; }
        if (!form.address.trim()) { setError("กรุณากรอกที่อยู่"); return; }

        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch("http://localhost:3000/places/create-place", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ ...form, tags: selectedTags, ...PRICE_MAP[form.priceRange] }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "สร้างร้านไม่สำเร็จ");
            onCreated(data);
        } catch (err) {
            setError(err.message || "สร้างร้านไม่สำเร็จ")
        } finally {
            setLoading(false);
        }
    }





    const provinces = [...new Set(geography.map(g => g.provinceNameTh))].sort();
    const districts = [...new Set(geography.filter(g => g.provinceNameTh === form.province).map(g => g.districtNameTh))].sort()
    const subdistricts = geography
        .filter(g => g.provinceNameTh === form.province && g.districtNameTh === form.district)
        .map(g => g.subdistrictNameTh)


    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
            onClick={onClose}
        >
            <div
                className="w-full sm:max-w-md bg-[#13131a] sm:rounded-2xl rounded-t-2xl border border-[#2a2a38] shadow-2xl shadow-black max-h-[92vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-[#13131a] flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#2a2a38] rounded-t-2xl">
                    <div>
                        <h2
                            className="font-black text-xl tracking-tight text-[#f0f0f8]"
                            style={{ fontFamily: "Syne, sans-serif" }}
                        >
                            เพิ่มร้านอาหาร
                        </h2>
                        <p className="text-xs text-[#6b6b80] mt-0.5">กรอกข้อมูลร้านของคุณ</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-[#1c1c26] border border-[#2a2a38] hover:border-[#3a3a48] flex items-center justify-center text-[#6b6b80] hover:text-[#f0f0f8] transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <div className="px-6 py-5 space-y-1">
                    <Input label="ชื่อร้าน *" placeholder="เช่น ครัวคุณแม่" value={form.name} onChange={set("name")} />
                    <Input label="คำอธิบาย" placeholder="เล่าเกี่ยวกับร้านของคุณ..." value={form.description} onChange={set("description")} />

                    {/* Category + Price row */}
                    <div className="grid grid-cols-1 gap-3">
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-[#6b6b80] mb-1.5">ประเภทสถานที่</label>
                            <select
                                value={form.place_type}
                                onChange={set("place_type")}
                                className="w-full bg-[#1c1c26] rounded-lg px-3.5 py-2.5 text-sm text-[#f0f0f8] outline-none border border-[#2a2a38] focus:border-[#7c6bff] transition-colors"
                            >
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-medium text-[#6b6b80] mb-1.5">ช่วงราคา</label>
                            <div className="grid grid-cols-4 gap-1">
                                {["100-250฿", "200-500฿", "400-800฿", "500-1000+฿"].map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setForm((f) => ({ ...f, priceRange: p }))}
                                        className={`py-2 rounded-lg text-xs font-bold transition-all ${form.priceRange === p
                                            ? "bg-[#e8ff47] text-[#0a0a0f]"
                                            : "bg-[#1c1c26] border border-[#2a2a38] text-[#6b6b80] hover:border-[#3a3a48]"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Input label="ที่อยู่ *" placeholder="เช่น 10/100 ตึก อาหาร" value={form.address} onChange={set("address")} />

                    <div className="mb-4">
                        <label className="block text-xs font-medium text-[#6b6b80] mb-1.5">จังหวัด *</label>
                        <select value={form.province} onChange={set("province")}
                            className="w-full bg-[#1c1c26] rounded-lg px-3.5 py-2.5 text-sm text-[#f0f0f8] outline-none border border-[#2a2a38] focus:border-[#7c6bff] transition-colors">
                            <option value="">เลือกจังหวัด</option>
                            {provinces.map((p, index) => <option key={`${p}-${index}`}>{p}</option>)}
                        </select>
                    </div>

                    {/* อำเภอ */}
                    <div className="mb-4">
                        <label className="block text-xs font-medium text-[#6b6b80] mb-1.5">อำเภอ/เขต *</label>
                        <select value={form.district} onChange={set("district")} disabled={!form.province}
                            className="w-full bg-[#1c1c26] rounded-lg px-3.5 py-2.5 text-sm text-[#f0f0f8] outline-none border border-[#2a2a38] focus:border-[#7c6bff] transition-colors disabled:opacity-40">
                            <option value="">เลือกอำเภอ</option>
                            {districts.map((d, index) => <option key={`${d}-${index}`}>{d}</option>)}
                        </select>
                    </div>

                    {/* ตำบล */}
                    <div className="mb-4">
                        <label className="block text-xs font-medium text-[#6b6b80] mb-1.5">ตำบล/แขวง *</label>
                        <select value={form.subdistrict} onChange={set("subdistrict")} disabled={!form.district}
                            className="w-full bg-[#1c1c26] rounded-lg px-3.5 py-2.5 text-sm text-[#f0f0f8] outline-none border border-[#2a2a38] focus:border-[#7c6bff] transition-colors disabled:opacity-40">
                            <option value="">เลือกตำบล</option>
                            {subdistricts.map((s, index) => <option key={`${s}-${index}`}>{s}</option>)}
                        </select>
                    </div>
                    <Input label="URL รูปภาพ" placeholder="https://..." value={form.image_url} onChange={set("image_url")} />

                    <ErrorAlert message={error} />
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-[#13131a] px-6 pb-6 pt-2 border-t border-[#2a2a38]">
                    <Btn onClick={handleSubmit} disabled={loading}>
                        {loading ? "กำลังบันทึก..." : "✦ สร้างร้านอาหาร"}
                    </Btn>
                </div>
            </div>
        </div>
    );
}