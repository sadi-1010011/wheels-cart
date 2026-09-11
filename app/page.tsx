"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SplashScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress bar logic
    const duration = 2500; // 2.5 seconds loading
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);
      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          router.push("/home");
        }, 400); // Small pause at 100% before navigating
      }
    }, interval);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#020617] antialiased">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmerSweep {
            0% { transform: translateX(-150%) skewX(-15deg); }
            100% { transform: translateX(150%) skewX(-15deg); }
        }
        .animate-sweep {
            animation: shimmerSweep 2.5s infinite ease-in-out;
        }
      `}} />

      {/* Deep cinematic background gradients */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <div className="absolute w-[150vw] h-[150vh] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#020617] to-[#020617]" />
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen animate-in fade-in duration-[2000ms]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen animate-in fade-in duration-[3000ms]" />
      </div>

      {/* Subtle Grid texture for depth */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.02]"
        style={{ 
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", 
          backgroundSize: "64px 64px" 
        }} 
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-10">
        
        {/* Animated Logo Mark */}
        <div className="relative flex items-center justify-center animate-in zoom-in-75 fade-in duration-1000 ease-out">
          {/* Outer glow */}
          <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full animate-pulse" />
          
          <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-[2.5rem] border border-white/10 bg-white/5 flex items-center justify-center backdrop-blur-2xl shadow-[0_0_80px_rgba(59,130,246,0.2)] overflow-hidden group">
            {/* Glass reflection sweep */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-sweep" />
            
            <img
              src="/icon-512x512.png"
              alt="WheelzCart Logo"
              className="relative w-full h-full object-cover scale-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            />
            {/* Inner static rim */}
            <div className="absolute inset-0 border-[4px] border-white/20 rounded-[2.5rem]" />
          </div>
        </div>

        {/* Brand Text */}
        <div className="flex flex-col items-center gap-4 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300 fill-mode-both">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl flex items-center">
            Wheelz
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 filter drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                Cart
            </span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-slate-500" />
            <p className="text-xs md:text-sm font-semibold tracking-[0.4em] uppercase text-slate-400">
                Premium Alloy Wheels
            </p>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-slate-500" />
          </div>
        </div>

        {/* High-end Progress Bar */}
        <div className="mt-8 flex flex-col items-center gap-4 animate-in fade-in duration-1000 delay-700 fill-mode-both w-full max-w-[280px] md:max-w-sm">
            <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden backdrop-blur-md border border-slate-700/50 shadow-inner">
                <div 
                    className="h-full bg-gradient-to-r from-primary via-blue-400 to-primary shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all duration-75 ease-linear rounded-full"
                    style={{ width: `${progress}%`, backgroundSize: '200% auto' }}
                />
            </div>
            <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase flex justify-between w-full px-2">
                <span className="animate-pulse">Initializing System</span>
                <span>{Math.round(progress)}%</span>
            </div>
        </div>

      </div>

      {/* Footer text */}
      <div className="absolute bottom-8 z-10 text-[10px] font-semibold tracking-[0.3em] text-slate-600 uppercase animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-[1200ms] fill-mode-both">
        Engineered for Excellence
      </div>
    </div>
  );
}