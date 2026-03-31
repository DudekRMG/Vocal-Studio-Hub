import { useState } from "react";
import { useLang } from "@/lib/langContext";
import { t } from "@/lib/i18n";

interface BookingFormProps {
  variant?: "kids";
  accentColor?: string;
}

export function BookingForm({ variant, accentColor }: BookingFormProps = {}) {
  const { lang } = useLang();
  const tx = t[lang].booking;

  const [form, setForm] = useState({ name: "", phone: "", goal: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status !== "idle") setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lang }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm({ name: "", phone: "", goal: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const isKids = variant === "kids";
  const btnColor = accentColor ?? (isKids ? "#3b82f6" : "#e8002d");
  const inputClass = isKids
    ? "bg-[#f4f7fc] border border-[#ccd5e3] outline-none w-full px-[1.4rem] py-[1.2rem] font-['DM_Sans'] text-[0.85rem] font-light text-[#7a8fa8] placeholder-[#7a8fa8] transition-colors duration-200 focus:bg-[#eef1f8] focus:border-[#aab8cc]"
    : "bg-[#141414] border-none outline-none w-full px-[1.4rem] py-[1.2rem] font-['DM_Sans'] text-[0.85rem] font-light text-[#f0eeea] placeholder-[#555] transition-colors duration-200 focus:bg-[#1a1a1a]";

  return (
    <form onSubmit={handleSubmit} className={isKids ? "bg-white border border-[#d0dae8] p-10" : "bg-[#080808] border border-white/[0.08] p-10"}>
      {status === "success" ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4" style={{ color: btnColor }}>✓</div>
          <h3 className={`font-display text-3xl tracking-[0.05em] mb-3 ${isKids ? "text-[#1a2535]" : ""}`}>{tx.successTitle}</h3>
          <p className={`text-[0.88rem] ${isKids ? "text-[#7a8fa8]" : "text-[rgba(240,238,234,0.5)]"}`}>{tx.successMsg}</p>
        </div>
      ) : (
        <>
          {/* Social proof */}
          <p className={`text-[0.75rem] tracking-[0.04em] text-center mb-6 pb-6 ${isKids ? "text-[#5a7a9f] border-b border-[#ccd5e3]" : "text-[rgba(240,238,234,0.38)] border-b border-white/[0.07]"}`}>
            {tx.socialProof}
          </p>

          <div className="flex flex-col gap-[1px] mb-[1px]">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder={tx.namePlaceholder}
              className={inputClass}
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder={tx.phonePlaceholder}
              className={inputClass}
            />
            <select
              name="goal"
              value={form.goal}
              onChange={handleChange}
              required
              className={`${inputClass} cursor-pointer ${form.goal ? (isKids ? "text-[#1a2535]" : "text-[#f0eeea]") : isKids ? "" : "text-[#555]"}`}
            >
              <option value="" disabled>{tx.goalPlaceholder}</option>
              {tx.goalOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {status === "error" && (
            <p className="text-[#e8002d] text-[0.8rem] px-4 py-2 mb-[1px] bg-[rgba(232,0,45,0.08)]">{tx.errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full border-none cursor-pointer font-display text-[1.1rem] tracking-[0.15em] py-[1.3rem] transition-all duration-200 hover:tracking-[0.22em] hover:opacity-90 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed text-[#f0eeea]"
            style={{ backgroundColor: btnColor }}
          >
            {status === "sending" ? tx.submitting : tx.submit}
            {status !== "sending" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
          <p className={`mt-5 text-[0.72rem] text-center tracking-[0.04em] ${isKids ? "text-[#7a8fa8]" : "text-[#555]"}`}>{tx.note}</p>
        </>
      )}
    </form>
  );
}
