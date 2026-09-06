"use client";

import TabNavbar from "@/components/TabNavbar";
import products from "@/data/products";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/hooks/useWishlist";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Build brand → models map from products
  const brandModelMap = products.reduce((acc, p) => {
    if (!acc[p.brand]) acc[p.brand] = [];
    if (!acc[p.brand].includes(p.model)) acc[p.brand].push(p.model);
    return acc;
  }, {} as Record<string, string[]>);

  const brands = Object.keys(brandModelMap).sort();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");

  // Build size options from products
  const allSizes = [...new Set(products.map(p => p.size))].sort((a, b) => parseInt(a) - parseInt(b));
  const [size, setSize] = useState("");

  const heroImages = [
    "/wheels/audi-a4.jpg",
    "/wheels/bmw-m4.jpg",
    "/wheels/mercedes-benz-a-class.jpg",
    "/wheels/jeep-compass.jpg",
    "/wheels/mg-astor.jpg",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateThemeState = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    // Initial sync
    updateThemeState();
    
    // Listen for custom themechange event from ThemeProvider
    window.addEventListener('themechange', updateThemeState);
    
    return () => window.removeEventListener('themechange', updateThemeState);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  // When brand changes, reset model
  useEffect(() => {
    if (brand && brandModelMap[brand] && !brandModelMap[brand].includes(model)) {
      setModel("");
    }
  }, [brand]);

  const handleFindWheels = () => {
    const params = new URLSearchParams();
    if (brand) params.set("brand", brand);
    if (model) params.set("model", model);
    if (size) params.set("size", size);
    router.push(`/shop?${params.toString()}`);
  };

  // Featured wheels — pick 4 varied ones
  const featuredWheels = [products[3], products[2], products[9], products[8]];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased font-display overflow-x-hidden pb-24">
      {/* Header with slide-down animation */}
      <header className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-4 fade-in duration-500">
        <div
          onClick={() => setShowSidebar(true)}
          className="md:hidden text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </div>
        <h1 className="text-slate-900 dark:text-slate-100 text-xl md:text-2xl font-extrabold leading-tight tracking-tight flex-1 md:flex-none text-center md:text-left">
          <Link href="/">
            Wheelz<span className="text-primary">Cart</span>
          </Link>
        </h1>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
          <Link href="/" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Home</Link>
          <Link href="/shop" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Shop</Link>
          <Link href="/wishlist" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Wishlist</Link>
        </nav>

        <div className="flex w-10 items-center justify-end">
          <button onClick={toggleTheme} className="relative flex items-center justify-center rounded-lg h-10 w-10 bg-transparent text-slate-900 dark:text-slate-100 transition-transform hover:scale-110 active:scale-90 group">
            <span className="material-symbols-outlined text-2xl group-hover:text-primary transition-colors">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </header>

      <main className="flex flex-col gap-6">
        {/* Hero Section */}
        <section className="px-4 pt-4 md:px-8 md:pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both" style={{ animationDelay: '100ms' }}>
          <div className="relative flex flex-col justify-end md:justify-center overflow-hidden rounded-xl min-h-80 md:min-h-125 shadow-2xl group transition-transform duration-500 hover:scale-[1.01]">

            {/* Background Images Crossfade */}
            {heroImages.map((img, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentHeroImage ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(16, 25, 34, 0.95) 0%, rgba(16, 25, 34, 0.4) 40%, rgba(0, 0, 0, 0) 100%), url("${img}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />
            ))}

            {/* Content overlay */}
            <div className="flex flex-col p-6 md:p-12 gap-4 relative z-10 transition-transform duration-500 group-hover:-translate-y-1">
              <h2 className="text-white text-3xl md:text-5xl font-extrabold leading-[1.1] tracking-tight">
                Premium Alloy <br />
                <span className="text-primary drop-shadow-[0_0_12px_rgba(19,127,236,0.6)] transition-all duration-300">Wheels.</span> Delivered.
              </h2>
              <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed max-w-70 md:max-w-md">
                Precision-engineered alloy wheels for every car brand.
              </p>
              <a href="/shop" className="flex pt-2">
                <button className="flex min-w-35 items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_8px_20px_-6px_rgba(19,127,236,0.6)] hover:-translate-y-1 active:translate-y-0 active:scale-95 shadow-lg shadow-primary/20">
                  <span>Browse Wheels</span>
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* Wheel Finder Section */}
        <section className="px-4 md:px-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both" style={{ animationDelay: '200ms' }}>
          <div className="bg-white dark:bg-slate-900/50 rounded-xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-500 hover:shadow-md dark:hover:border-slate-700">
            <div className="items-center gap-2 mb-6 md:mb-8 group cursor-pointer inline-flex">
              <span className="material-symbols-outlined text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                tire_repair
              </span>
              <h2 className="text-slate-900 dark:text-slate-100 text-xl md:text-2xl font-bold tracking-tight">
                Find Your Wheel
              </h2>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:flex-1 space-y-1.5 focus-within:-translate-y-0.5 transition-transform duration-300">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1 transition-colors">
                  Car Brand
                </label>
                <div className="relative group/select">
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full appearance-none bg-slate-100 dark:bg-slate-800 border-none rounded-lg h-12 px-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 transition-all duration-300 cursor-pointer group-hover/select:bg-slate-200 dark:group-hover/select:bg-slate-700/80"
                  >
                    <option value="">All Brands</option>
                    {brands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-slate-400 transition-transform duration-300 group-hover/select:translate-y-0.5">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="w-full md:flex-2 grid grid-cols-2 gap-4">
                <div className="space-y-1.5 focus-within:-translate-y-0.5 transition-transform duration-300">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
                    Model
                  </label>
                  <div className="relative group/select">
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full h-12 appearance-none bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 transition-all duration-300 cursor-pointer group-hover/select:bg-slate-200 dark:group-hover/select:bg-slate-700/80"
                    >
                      <option value="">All Models</option>
                      {brand && brandModelMap[brand]?.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                      {!brand && [...new Set(products.map(p => p.model))].sort().map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-slate-400 transition-transform duration-300 group-hover/select:translate-y-0.5">
                      expand_more
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5 focus-within:-translate-y-0.5 transition-transform duration-300">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
                    Size
                  </label>
                  <div className="relative group/select">
                    <select
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full appearance-none bg-slate-100 dark:bg-slate-800 border-none rounded-lg h-12 px-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 transition-all duration-300 cursor-pointer group-hover/select:bg-slate-200 dark:group-hover/select:bg-slate-700/80"
                    >
                      <option value="">All Sizes</option>
                      {allSizes.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-slate-400 transition-transform duration-300 group-hover/select:translate-y-0.5">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto md:min-w-40 block mt-2 md:mt-0">
                <button onClick={handleFindWheels} className="w-full flex items-center justify-center gap-2 rounded-lg h-12 bg-primary/10 dark:bg-primary/20 text-primary text-base font-bold transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]">
                  <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:scale-110">search</span>
                  Find Wheels
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Size Filter Pills */}
        <section className="flex flex-col gap-4 px-0 md:px-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between px-4 md:px-0">
            <h2 className="text-slate-900 dark:text-slate-100 text-lg md:text-xl font-bold">
              Shop by Size
            </h2>
          </div>

          <div className="flex gap-3 overflow-x-auto px-4 md:px-0 pb-3 pt-1 hide-scrollbar scroll-smooth">
            {allSizes.map((s, idx) => (
              <div
                key={s}
                onClick={() => router.push(`/shop?size=${encodeURIComponent(s)}`)}
                className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer animate-in fade-in zoom-in-95 duration-500 fill-mode-both"
                style={{ animationDelay: `${350 + idx * 80}ms` }}
              >
                <div className="size-18 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-all duration-500 ease-out group-hover:scale-110 group-hover:border-primary/40 group-hover:shadow-[0_8px_20px_-6px_rgba(19,127,236,0.3)] group-active:scale-95">
                  <span className="text-primary text-xl font-extrabold transition-transform duration-500 ease-out group-hover:scale-110">
                    {s}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors group-hover:text-primary">
                  {s} Wheels
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Wheels Section */}
        <section className="flex flex-col gap-4 px-4 md:px-8 pb-4 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-slate-900 dark:text-slate-100 text-lg md:text-xl font-bold">
              Featured Wheels
            </h2>
            <Link href="/shop" className="text-primary text-sm font-semibold transition-all duration-300 hover:text-blue-600 hover:underline active:opacity-70">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredWheels.map((product) => (
              <div key={product.id} className="flex flex-col gap-2 group cursor-pointer overflow-hidden">
                <a
                  href={`/product?id=${product.id}`}
                  className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 group-active:scale-[0.98]"
                  style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
                >
                  <img
                    className="w-full h-full rounded-xl object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    alt={product.name}
                    src={product.image}
                  />
                  {/* Gloss overlay effect */}
                  <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay rotate-12 scale-[2]" />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-2 right-2 size-8 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-white transition-all duration-300 hover:bg-white hover:text-red-500 hover:scale-110 active:scale-90"
                  >
                    <span
                      className={`material-symbols-outlined text-sm transition-transform group-hover:scale-110 ${isInWishlist(product.id) ? 'text-red-500' : ''}`}
                      style={{ fontVariationSettings: isInWishlist(product.id) ? '"FILL" 1' : '"FILL" 0' }}
                    >
                      favorite
                    </span>
                  </button>
                </a>
                <div className="transition-transform duration-300 group-hover:translate-x-1">
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    {product.brand} · {product.size}
                  </p>
                  <h3 className="text-slate-900 dark:text-slate-100 font-bold text-sm truncate group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const message = `Hi! I'm interested in this alloy wheel:\n\n*${product.name}*\n*Size:* ${product.size}\n*PCD:* ${product.pcd}\n*Finish:* ${product.finish}\n\nProduct: ${window.location.origin}/product?id=${product.id}`;
                        window.open(`https://wa.me/916238998062?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className="w-full flex items-center justify-center gap-1.5 h-8 rounded-md bg-primary/10 text-primary text-xs font-bold transition-all duration-300 hover:bg-primary hover:text-white active:scale-95 group-hover:bg-primary group-hover:text-white"
                    >
                      <span className="material-symbols-outlined text-[14px]">forum</span>
                      Enquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <TabNavbar active="home" />

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-100 flex">
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
              <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors font-medium">
                <span className="material-symbols-outlined">home</span>
                Home
              </Link>
              <Link href="/shop" className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors font-medium">
                <span className="material-symbols-outlined">storefront</span>
                Shop
              </Link>
              <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors font-medium">
                <span className="material-symbols-outlined">favorite</span>
                Wishlist
              </Link>

              <div className="my-4 border-t border-slate-200 dark:border-slate-800" />

              <div className="px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Support & Legal
              </div>
              <Link href="/privacy-policy" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors text-sm">
                <span className="material-symbols-outlined text-[20px]">policy</span>
                Privacy Policy
              </Link>
              <Link href="/cookie-policy" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors text-sm">
                <span className="material-symbols-outlined text-[20px]">cookie</span>
                Cookie Policy
              </Link>
              <Link href="/terms" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors text-sm">
                <span className="material-symbols-outlined text-[20px]">gavel</span>
                Terms of Service
              </Link>
              <Link href="/contact" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors text-sm">
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
