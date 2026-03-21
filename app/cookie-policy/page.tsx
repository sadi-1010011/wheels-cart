import Link from "next/link";

export default function CookiePolicy() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased font-display overflow-x-hidden pb-24">
      <header className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-4 fade-in duration-500">
        <Link href="/home" className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </Link>
        <h1 className="text-slate-900 dark:text-slate-100 text-xl font-extrabold leading-tight tracking-tight flex-1 text-center">
          Cookie <span className="text-primary">Policy</span>
        </h1>
        <div className="flex w-10 items-center justify-end" />
      </header>

      <main className="flex flex-col gap-6 px-4 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both" style={{ animationDelay: '100ms' }}>
        <div className="bg-white dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm leading-relaxed text-sm text-slate-700 dark:text-slate-300 space-y-4">
          <p className="font-bold text-slate-900 dark:text-slate-100">Last updated: March 2026</p>
          
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4">1. What Are Cookies</h2>
          <p>Cookies are small text files stored on your device when you visit our website. They help us enhance your browsing experience and understand how you use WheelzCart.</p>
          
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4">2. Types of Cookies We Use</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-slate-900 dark:text-slate-100">Essential Cookies:</strong> Required for the website to function properly, such as keeping you logged in.</li>
            <li><strong className="text-slate-900 dark:text-slate-100">Analytics Cookies:</strong> Help us understand how visitors interact with our site by collecting anonymous data.</li>
            <li><strong className="text-slate-900 dark:text-slate-100">Preference Cookies:</strong> Remember your choices, like theme preferences or selected vehicle models.</li>
          </ul>
          
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4">3. Managing Cookies</h2>
          <p>You can control or delete cookies through your browser settings. However, disabling certain cookies may affect the functionality of our website.</p>
        </div>
      </main>
    </div>
  );
}
