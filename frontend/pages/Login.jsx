import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Btn, Divider, ErrorAlert } from "../components/FormElements.jsx";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const handleSubmit = async () => {
        if (!form.email || !form.password) {
            setError("กรุณากรอก email และ password");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");

            localStorage.setItem("token", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);
            navigate("/Home"); // เปลี่ยนเป็น route ที่ต้องการหลัง login
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-[60px] flex items-center justify-center px-4">
            <div className="bg-[#13131a] border border-[#2a2a38] rounded-2xl p-8 w-full max-w-sm">
                {/* Header */}
                <div className="mb-8">
                    <h2
                        className="font-black text-2xl tracking-tight"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        ยินดีต้อนรับกลับ
                    </h2>
                    <p className="text-[#6b6b80] text-sm mt-1">เข้าสู่ระบบเพื่อจัดการออเดอร์</p>
                </div>

                {/* Form */}
                <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={set("email")}
                />
                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set("password")}
                />

                <div className="flex justify-end mb-5">
                    <span className="text-xs text-[#7c6bff] cursor-pointer hover:underline">
                        ลืมรหัสผ่าน?
                    </span>
                </div>

                <Btn onClick={handleSubmit} disabled={loading}>
                    {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                </Btn>

                <Divider text="หรือ" />

                <Link to="/register" className="block no-underline">
                    <Btn variant="secondary">สร้างบัญชีใหม่</Btn>
                </Link>
            </div>
        </div>
    );
}