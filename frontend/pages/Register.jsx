import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Btn, Divider, ErrorAlert, SuccessAlert } from "../components/FormElements.jsx";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const handleSubmit = async () => {
        if (!form.firstName || !form.lastName || !form.email || !form.password) {
            setError("กรุณากรอกข้อมูลให้ครบ");
            return;
        }
        if (form.password.length < 8) {
            setError("Password ต้องมีอย่างน้อย 8 ตัวอักษร");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError("Password ไม่ตรงกัน");
            return;
        }
        if (!agreed) {
            setError("กรุณายอมรับ Terms of Service ก่อน");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    password: form.password,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Register failed");

            setSuccess("สมัครสมาชิกสำเร็จ! กำลังพาไป Login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-[60px] flex items-center justify-center px-4 py-16">
            <div className="bg-[#13131a] border border-[#2a2a38] rounded-2xl p-8 w-full max-w-sm">
                {/* Header */}
                <div className="mb-8">
                    <h2
                        className="font-black text-2xl tracking-tight"
                        style={{ fontFamily: "Syne, sans-serif" }}
                    >
                        สร้างบัญชีใหม่
                    </h2>
                    <p className="text-[#6b6b80] text-sm mt-1">เริ่มต้นใช้งาน OMS ได้เลย</p>
                </div>

                {/* Form */}
                <div className="grid grid-cols-2 gap-3">
                    <Input label="ชื่อ" placeholder="สมชาย" value={form.firstName} onChange={set("firstName")} />
                    <Input label="นามสกุล" placeholder="ใจดี" value={form.lastName} onChange={set("lastName")} />
                </div>
                <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
                <Input label="Password" type="password" placeholder="อย่างน้อย 8 ตัวอักษร" value={form.password} onChange={set("password")} />
                <Input label="Confirm Password" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={set("confirmPassword")} />

                <ErrorAlert message={error} />
                <SuccessAlert message={success} />

                {/* Terms */}
                <label className="flex items-start gap-2.5 cursor-pointer mb-5">
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 accent-[#e8ff47]"
                    />
                    <span className="text-xs text-[#6b6b80] leading-relaxed">
                        ฉันยอมรับ{" "}
                        <span className="text-[#7c6bff] cursor-pointer hover:underline">Terms of Service</span>{" "}
                        และ{" "}
                        <span className="text-[#7c6bff] cursor-pointer hover:underline">Privacy Policy</span>
                    </span>
                </label>

                <Btn onClick={handleSubmit} disabled={loading}>
                    {loading ? "กำลังสมัคร..." : "สร้างบัญชี"}
                </Btn>

                <Divider text="มีบัญชีอยู่แล้ว?" />

                <Link to="/login" className="block no-underline">
                    <Btn variant="secondary">เข้าสู่ระบบ</Btn>
                </Link>
            </div>
        </div>
    );
}