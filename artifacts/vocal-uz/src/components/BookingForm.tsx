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
    ? "bg-[#f4f7fc] border border-[#ccd5e3] outline-none w-full px-[1.4rem] py-[1.2rem] font-['Inter'] text-[0.80rem] font-light text-[#7a8fa8] placeholder-[#7a8fa8] transition-colors duration-200 focus:bg-[#eef1f8] focus:border-[#aab8cc]"
    : "bg-[#141414] border-none outline-none w-full px-[1.4rem] py-[1.2rem] font-['Inter'] text-[0.80rem] font-light text-[#f0eeea] placeholder-[#555] transition-colors duration-200 focus:bg-[#1a1a1a]";

  const kidsInnerInputClass = "bg-[#f4f7fc] border-none outline-none w-full px-[1.4rem] py-[1.2rem] font-['Inter'] text-[0.80rem] font-light text-[#7a8fa8] placeholder-[#7a8fa8] transition-colors duration-200 focus:bg-[#eef1f8]";

  const dividerColor = isKids ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.08)";
  const dividerTextColor = isKids ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.22)";

  return (
    <form
      onSubmit={handleSubmit}
      className={isKids ? "bg-white border border-[#d0dae8] pt-6 px-10 pb-10" : "bg-[#080808] border border-white/[0.08] pt-6 px-10 pb-10"}
    >
      {status === "success" ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4" style={{ color: btnColor }}>✓</div>
          <h3 className={`font-display text-3xl tracking-[0.05em] mb-3 ${isKids ? "text-[#1a2535]" : ""}`}>{tx.successTitle}</h3>
          <p className={`text-[0.88rem] ${isKids ? "text-[#7a8fa8]" : "text-[rgba(240,238,234,0.5)]"}`}>{tx.successMsg}</p>
        </div>
      ) : (
        <>
          {/* Social proof — no divider line, stars in accent color, text white/dark */}
          <p className="text-center mb-5 tracking-[0.1em] uppercase text-[0.68rem]">
            <span style={{ color: btnColor }}>★★★★★</span>
            <span className={`ml-2 ${isKids ? "text-[#1a2535]" : "text-white"}`}>{tx.socialProof}</span>
          </p>

          {isKids ? (
            <>
              <div className="border border-b-0 border-[#ccd5e3]">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder={tx.namePlaceholder}
                  className={kidsInnerInputClass}
                  style={{ borderBottom: "1px solid #ccd5e3" }}
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder={tx.phonePlaceholder}
                  className={kidsInnerInputClass}
                  style={{ borderBottom: "1px solid #ccd5e3" }}
                />
                <div className="relative">
                  <select
                    name="goal"
                    value={form.goal}
                    onChange={handleChange}
                    required
                    className={`${kidsInnerInputClass} cursor-pointer appearance-none pr-10 ${form.goal ? "text-[#1a2535]" : ""}`}
                  >
                    <option value="" disabled>{tx.goalPlaceholder}</option>
                    {tx.goalOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#7a8fa8]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                  </span>
                </div>
                {status === "error" && (
                  <p className="text-[#e8002d] text-[0.8rem] px-4 py-2 bg-[rgba(232,0,45,0.08)]">{tx.errorMsg}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full cursor-pointer font-display text-[1.2rem] tracking-[0.15em] py-[1.3rem] transition-all duration-200 hover:tracking-[0.22em] hover:opacity-90 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed text-[#f0eeea]"
                style={{ backgroundColor: btnColor, border: `1px solid ${btnColor}` }}
              >
                {status === "sending" ? tx.submitting : tx.submit}
                {status !== "sending" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </>
          ) : (
            <>
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
                <div className="relative">
                  <select
                    name="goal"
                    value={form.goal}
                    onChange={handleChange}
                    required
                    className={`${inputClass} cursor-pointer appearance-none pr-10 ${form.goal ? "text-[#f0eeea]" : "text-[#555]"}`}
                  >
                    <option value="" disabled>{tx.goalPlaceholder}</option>
                    {tx.goalOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#555]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                  </span>
                </div>
              </div>

              {status === "error" && (
                <p className="text-[#e8002d] text-[0.8rem] px-4 py-2 mb-[1px] bg-[rgba(232,0,45,0.08)]">{tx.errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full border-none cursor-pointer font-display text-[1.2rem] tracking-[0.15em] py-[1.3rem] transition-all duration-200 hover:tracking-[0.22em] hover:opacity-90 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed text-[#f0eeea]"
                style={{ backgroundColor: btnColor }}
              >
                {status === "sending" ? tx.submitting : tx.submit}
                {status !== "sending" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 mt-4 mb-4">
            <div className="flex-1 h-px" style={{ backgroundColor: dividerColor }} />
            <span className={`text-[0.72rem] tracking-[0.04em] uppercase whitespace-nowrap ${isKids ? "text-[#7a8fa8]" : "text-[#555]"}`}>
              {tx.callDivider}
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: dividerColor }} />
          </div>

          {/* Call button */}
          <a
            href="tel:+998338622589"
            className="w-full flex items-center justify-center gap-3 py-[1rem] px-5 border bg-transparent no-underline transition-all duration-200 hover:opacity-75"
            style={{ borderColor: btnColor, color: isKids ? btnColor : "#f0eeea" }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={btnColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.4 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.51 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73A16 16 0 0 0 15.27 16.09l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span className="flex flex-col items-center leading-tight">
              <span className="font-display text-[1.0rem] tracking-[0.1em] uppercase">+998-33-VOCAL-UZ</span>
              <span className="text-[0.58rem] mt-[4px] tracking-[0.06em] uppercase" style={{ opacity: 0.5 }}>{tx.dialPrefix} +998 33 862-25-89</span>
            </span>
          </a>
        </>
      )}
    </form>
  );
}
