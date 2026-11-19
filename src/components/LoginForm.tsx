"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ phone: "", password: "", name: "", email: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "เกิดข้อผิดพลาด");
        return;
      }
      if (data.user?.role === "admin") {
        window.location.href = "/admin";
      } else {
        router.push("/account");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 pt-40 pb-24">
      <div className="card-frame rounded-2xl p-9">
        <div className="text-center">
          <p className="label-caps text-gold">THEDA MEMBER</p>
          <h1 className="mt-3 font-display text-3xl">{mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}</h1>
        </div>

        <div className="mt-7 grid grid-cols-2 rounded-full bg-ivory p-1 text-xs">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-full py-2.5 tracking-widest transition-colors ${
                mode === m ? "bg-espresso text-cream" : "text-taupe"
              }`}
            >
              {m === "login" ? "เข้าสู่ระบบ" : "สมัครใหม่"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-7 space-y-4">
          {mode === "register" && (
            <>
              <label className="block">
                <span className="mb-1.5 block text-xs text-taupe">ชื่อ-นามสกุล *</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="field"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs text-taupe">อีเมล (ถ้ามี)</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="field"
                />
              </label>
            </>
          )}
          <label className="block">
            <span className="mb-1.5 block text-xs text-taupe">เบอร์โทรศัพท์ *</span>
            <input
              required
              inputMode="tel"
              placeholder="0XXXXXXXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="field"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-taupe">รหัสผ่าน *</span>
            <input
              required
              type="password"
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="field"
            />
          </label>

          {error && <p className="rounded-lg bg-espresso px-4 py-3 text-xs text-cream">{error}</p>}

          <button
            disabled={busy}
            className="w-full rounded-full bg-espresso py-3.5 text-sm tracking-[0.2em] text-cream transition-colors hover:bg-gold hover:text-white disabled:opacity-50"
          >
            {busy ? "..." : mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </button>
        </form>

        <p className="mt-5 text-center text-[0.68rem] leading-relaxed text-taupe">
          สมัครด้วยเบอร์โทร — ใช้เบอร์เดียวกันทุกครั้งเพื่อสะสมประวัติออเดอร์
          <br />
          (ระบบ OTP ทาง SMS และ LINE Login จะเปิดใช้ในเฟสถัดไป)
        </p>
      </div>

      <style jsx global>{`
        .field {
          width: 100%;
          border: 1px solid rgba(30, 58, 110, 0.25);
          background: #fff;
          border-radius: 0.6rem;
          padding: 0.75rem 0.9rem;
          font-size: 0.875rem;
          outline: none;
        }
        .field:focus {
          border-color: #cf242b;
        }
      `}</style>
    </div>
  );
}
