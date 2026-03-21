import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased font-display overflow-x-hidden pb-24">
      <header className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-4 fade-in duration-500">
        <Link href="/home" className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </Link>
        <h1 className="text-slate-900 dark:text-slate-100 text-xl font-extrabold leading-tight tracking-tight flex-1 text-center">
          Privacy <span className="text-primary">Policy</span>
        </h1>
        <div className="flex w-10 items-center justify-end" />
      </header>

      <main className="flex flex-col gap-6 px-4 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both" style={{ animationDelay: '100ms' }}>
        <div className="bg-white dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm leading-relaxed text-sm text-slate-700 dark:text-slate-300 space-y-4">
          <p className="font-bold text-slate-900 dark:text-slate-100">Last updated: March 2026</p>
          
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you use WheelzCart, including your name, email address, shipping address, and payment information.</p>
          
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to process transactions, provide customer support, and send you updates about your orders and our services.</p>
          
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4">3. Data Sharing and Security</h2>
          <p>We do not share your personal information with third parties except as necessary to fulfill your orders (e.g., shipping partners) or as required by law. We take appropriate security measures to protect your data.</p>
          
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4">4. Your Rights</h2>
          <p>You have the right to access, update, or delete your personal information. Contact our support team for assistance with your data.</p>
        </div>
      </main>
    </div>
  );
}
