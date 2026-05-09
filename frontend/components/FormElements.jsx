import { useState } from "react";

export function Input({ label, type = "text", placeholder, value, onChange }) {
    const [focused, setFocused] = useState(false);
    return (
        <div className="mb-4">
            <label className="block text-xs font-medium text-[#6b6b80] mb-1.5">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={`w-full bg-[#1c1c26] rounded-lg px-3.5 py-2.5 text-sm text-[#f0f0f8] outline-none transition-colors placeholder:text-[#3a3a48] border ${focused ? "border-[#7c6bff]" : "border-[#2a2a38]"
                    }`}
            />
        </div>
    );
}

export function Btn({ children, variant = "primary", onClick, disabled, type = "button" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`w-full py-3 rounded-lg text-sm font-bold transition-opacity hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed ${variant === "primary"
                ? "bg-[#e8ff47] text-[#0a0a0f]"
                : "bg-[#1c1c26] border border-[#2a2a38] text-[#f0f0f8]"
                }`}
        >
            {children}
        </button>
    );
}

export function Divider({ text }) {
    return (
        <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#2a2a38]" />
            <span className="text-xs text-[#6b6b80]">{text}</span>
            <div className="flex-1 h-px bg-[#2a2a38]" />
        </div>
    );
}

export function ErrorAlert({ message }) {
    if (!message) return null;
    return (
        <div className="bg-[#ff4d6d]/10 border border-[#ff4d6d]/30 rounded-lg px-3.5 py-2.5 text-sm text-[#ff4d6d] mb-4">
            {message}
        </div>
    );
}

export function SuccessAlert({ message }) {
    if (!message) return null;
    return (
        <div className="bg-[#e8ff47]/10 border border-[#e8ff47]/30 rounded-lg px-3.5 py-2.5 text-sm text-[#e8ff47] mb-4">
            {message}
        </div>
    );
}