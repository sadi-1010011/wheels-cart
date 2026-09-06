"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SplashScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    // Phase timeline: enter (0ms) → hold (900ms) → exit (2800ms) → navigate (3600ms)
    const holdTimer = setTimeout(() => setPhase("hold"), 900);
    const exitTimer = setTimeout(() => setPhase("exit"), 2800);
    const navTimer = setTimeout(() => router.push("/home"), 3600);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(navTimer);
    };
  }, [router]);

  return (
    <>
      <div
        className={`splash-${phase} relative flex h-screen w-full flex-col overflow-hidden`}
        style={{
          background: "linear-gradient(135deg, #0a0a0f 0%, #0f111a 40%, #111827 70%, #0a0c14 100%)",
        }}
      >
        {/* ── Ambient streak lights ── */}
        <div className="streak-1 absolute -left-24 top-1/4 w-175 h-87.5 rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)" }} />
        <div className="streak-2 absolute -right-24 bottom-1/4 w-150 h-75 rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.10) 0%, transparent 70%)" }} />

        {/* ── Subtle grid texture ── */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* ── Speed lines (decorative) ── */}
        <div className="absolute top-1/2 left-0 right-0 flex flex-col gap-1 opacity-0 anim-car pointer-events-none" style={{ marginTop: "-60px" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-px w-full"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.6) 40%, rgba(99,102,241,0.8) 60%, transparent 100%)",
                opacity: 0.4 - i * 0.08,
                marginLeft: `${i * 5}%`,
              }} />
          ))}
        </div>

        {/* ── Background car image ── */}
        <div className="absolute inset-0 z-0"
          style={{ opacity: phase === "exit" ? 0 : 0.08, transition: "opacity 0.6s" }}>
          <img
            alt="Sports car silhouette"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVomc0tEjWTZL5gHfqxV0WPchGpY9DlLU0DPppfPlxSdGO2MQ0XVNZ1j026LMnBmzI0DogAElEuS4_cJStuCvwmZG9Dkll5s5gzH3-YG7p9UiNH35PnACJu3VyNtK8MPojGxIhrzdgyMXXctPds3o_4kotTnOR_mCXJHe-cbi80jsPKqK5Yiqkh9sv1V6GcP-xKwHw1gCYN4pwQYEQD35A3LnpYejKPlxT_XKfMtE6xKlpwrXpjUNXWHwi4qa8M2aWu7rF_1DsZUs"
          />
        </div>
        <div className="absolute inset-0 z-0"
          style={{ background: "linear-gradient(to top, #0a0c14 0%, rgba(10,12,20,0.5) 50%, #0a0c14 100%)" }} />

        {/* ── Central branding ── */}
        <main className="relative z-20 flex flex-col items-center justify-center flex-1 text-center px-6">

          {/* Logo icon */}
          <div className="anim-logo mb-8 relative">
            {/* Glow halo */}
            <div className="absolute inset-0 rounded-2xl blur-2xl"
              style={{ background: "rgba(59,130,246,0.35)", animation: "glowPulse 2.5s ease-in-out 1s infinite" }} />
            <div
              className="relative w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
                border: "1px solid rgba(59,130,246,0.3)",
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Shimmer sweep */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="shimmer-bar absolute top-0 bottom-0 w-1/4"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
              </div>
              <span
                className="material-symbols-outlined text-6xl"
                style={{
                  fontVariationSettings: '"FILL" 1',
                  color: "#3b82f6",
                  filter: "drop-shadow(0 0 12px rgba(59,130,246,0.7))",
                }}
              >
                tire_repair
              </span>
            </div>
          </div>

          {/* Brand name */}
          <h1
            className="anim-title font-headline font-extrabold text-6xl md:text-8xl tracking-tighter mb-3 text-white"
            style={{ filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.5))" }}
          >
            Wheelz<span style={{ color: "#3b82f6", filter: "drop-shadow(0 0 20px rgba(59,130,246,0.6))" }}>Cart</span>
          </h1>

          {/* Tagline */}
          <p className="anim-tagline font-body text-sm md:text-base font-medium uppercase mb-8"
            style={{ color: "rgba(148,163,184,0.9)", letterSpacing: "0.2em" }}>
            Premium Alloy Wheels for Every Ride
          </p>

          {/* Precision divider */}
          <div className="anim-line flex items-center gap-4 w-56 mb-12"
            style={{ transformOrigin: "center" }}>
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.7), transparent)" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#3b82f6", boxShadow: "0 0 8px rgba(59,130,246,0.8)" }} />
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.7), transparent)" }} />
          </div>

          {/* Loading dots */}
          <div className="anim-dots flex gap-2 items-end">
            <div className="dot-1 w-2 h-2 rounded-full" style={{ background: "#3b82f6" }} />
            <div className="dot-2 w-2 h-2 rounded-full" style={{ background: "rgba(59,130,246,0.6)" }} />
            <div className="dot-3 w-2 h-2 rounded-full" style={{ background: "rgba(59,130,246,0.3)" }} />
          </div>
        </main>

        {/* ── Version label ── */}
        <div className="anim-version relative z-20 flex justify-center pb-8">
          <span className="text-[10px] font-label tracking-[0.4em] uppercase"
            style={{ color: "rgba(100,116,139,0.7)" }}>
            Premium Quality Alloy Wheels
          </span>
        </div>

        {/* ── Carbon fibre micro-texture overlay ── */}
        <div className="splash-overlay fixed inset-0 pointer-events-none z-50"
          style={{
            opacity: 0.035,
            backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')"
          }} />
      </div>
    </>
  );
}