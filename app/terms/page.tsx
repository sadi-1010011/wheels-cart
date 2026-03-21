import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased font-display overflow-x-hidden pb-24">
      <header className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-4 fade-in duration-500">
        <Link href="/home" className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </Link>
        <h1 className="text-slate-900 dark:text-slate-100 text-xl font-extrabold leading-tight tracking-tight flex-1 text-center">
          Terms of <span className="text-primary">Service</span>
        </h1>
        <div className="flex w-10 items-center justify-end" />
      </header>

      <main className="flex flex-col gap-6 px-4 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both" style={{ animationDelay: '100ms' }}>
        <div className="bg-white dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm leading-relaxed text-sm text-slate-700 dark:text-slate-300 space-y-4">
          <p className="font-bold text-slate-900 dark:text-slate-100">Last updated: March 2026</p>
          
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4">1. Acceptance of Terms</h2>
          <p>By accessing and using WheelzCart, you accept and agree to be bound by the terms and provisions of this agreement.</p>
          
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4">2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials on WheelzCart's website for personal, non-commercial transitory viewing only.</p>
          
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4">3. Disclaimer</h2>
          <p>The materials on WheelzCart's website are provided on an 'as is' basis. WheelzCart makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4">4. Limitations</h2>
          <p>In no event shall WheelzCart or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on WheelzCart's website.</p>
        </div>
      </main>
    </div>
  );
}
