"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/hooks/useWishlist";
import { useState, useEffect } from "react";

interface TopNavbarProps {
  title?: React.ReactNode;
  showSidebarToggle?: boolean;
}

export function TopNavbar({ title, showSidebarToggle }: TopNavbarProps) {
  const router = useRouter();
  const { wishlist, isLoaded } = useWishlist();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    const updateTheme = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    window.addEventListener('themechange', updateTheme);
    return () => window.removeEventListener('themechange', updateTheme);
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    setIsDarkMode(next);
    window.dispatchEvent(new Event('themechange'));
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-4 fade-in duration-500">
          <div className="flex items-center gap-4">
              {showSidebarToggle ? (
                  <button onClick={() => setShowSidebar(true)} className="md:hidden text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer">
                      <span className="material-symbols-outlined text-2xl">menu</span>
                  </button>
              ) : (
                  <button onClick={() => router.back()} className="md:hidden text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-90">
                      <span className="material-symbols-outlined">arrow_back</span>
                  </button>
              )}
              {title ? (
                  typeof title === "string" ? (
                      <h1 className="text-lg md:text-xl font-bold leading-tight tracking-tight">{title}</h1>
                  ) : title
              ) : (
                  <h1 className="text-slate-900 dark:text-slate-100 text-xl md:text-2xl font-extrabold leading-tight tracking-tight flex-1 md:flex-none text-center md:text-left">
                      <Link href="/">Wheelz<span className="text-primary">Cart</span></Link>
                  </h1>
              )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
              <Link href="/home" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Home</Link>
              <Link href="/shop" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Shop</Link>
              <Link href="/wishlist" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Wishlist</Link>
          </nav>

          <div className="flex w-24 items-center justify-end gap-2">
              <button onClick={toggleTheme} className="relative flex items-center justify-center rounded-lg h-10 w-10 bg-transparent text-slate-900 dark:text-slate-100 transition-transform hover:scale-110 active:scale-90 group">
                  <span className="material-symbols-outlined text-2xl group-hover:text-primary transition-colors">
                      {isDarkMode ? 'light_mode' : 'dark_mode'}
                  </span>
              </button>
              {isLoaded && wishlist.length > 0 && (
                  <button onClick={() => router.push("/wishlist")} className="relative p-2 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all duration-300 hover:scale-110 active:scale-90 group hidden md:flex">
                      <span className="material-symbols-outlined group-hover:text-primary transition-colors">favorite</span>
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm shadow-primary/40 animate-pulse">
                          {wishlist.length}
                      </span>
                  </button>
              )}
          </div>
      </header>

      {/* Sidebar Overlay */}
      {showSidebar && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setShowSidebar(false)}
          />

          {/* Sidebar Content */}
          <div className="relative w-72 max-w-[80vw] h-full bg-background-light dark:bg-background-dark shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                Wheelz<span className="text-primary">Cart</span>
              </h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 active:scale-90"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 hide-scrollbar">
              <Link href="/home" onClick={() => setShowSidebar(false)} className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors font-medium">
                <span className="material-symbols-outlined">home</span>
                Home
              </Link>
              <Link href="/shop" onClick={() => setShowSidebar(false)} className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors font-medium">
                <span className="material-symbols-outlined">storefront</span>
                Shop
              </Link>
              <Link href="/wishlist" onClick={() => setShowSidebar(false)} className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors font-medium">
                <span className="material-symbols-outlined">favorite</span>
                Wishlist
              </Link>

              <div className="my-4 border-t border-slate-200 dark:border-slate-800" />

              <div className="px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Support & Legal
              </div>
              <Link href="/privacy-policy" onClick={() => setShowSidebar(false)} className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors text-sm">
                <span className="material-symbols-outlined text-[20px]">policy</span>
                Privacy Policy
              </Link>
              <Link href="/cookie-policy" onClick={() => setShowSidebar(false)} className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors text-sm">
                <span className="material-symbols-outlined text-[20px]">cookie</span>
                Cookie Policy
              </Link>
              <Link href="/terms" onClick={() => setShowSidebar(false)} className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors text-sm">
                <span className="material-symbols-outlined text-[20px]">gavel</span>
                Terms of Service
              </Link>
              <Link href="/contact" onClick={() => setShowSidebar(false)} className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors text-sm">
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
