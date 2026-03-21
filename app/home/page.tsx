"use client";

import TabNavbar from "@/components/TabNavbar";
import carList from "@/data/car-list.json";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/hooks/useWishlist";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [brand, setBrand] = useState(carList[0]?.brand || "");
  const brandObj = carList.find(c => c.brand === brand) || carList[0];
  const [model, setModel] = useState(brandObj?.models[0] || "");
  const [year, setYear] = useState("2024");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const heroImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAE1xwm4lAQXu9FOXDlCQnSFD3JyTe-Gk8_xsfNixXVy1V3DNOXl_nC0IKOK3lMk1432Uv5PH9U60gvMe0EO2qBtoc_9X6R7ZFjwrErg706Eqa1S4K1gkf46ufda-H4UooHtc5Yh-hUzX4C-JuI-ht3Orqi3Ebz5eqM_KRkdCcj0zx9HkSchoQi1tF6efrkHfgEhEfOPaX8S_iQZXnfHPj98YFI-VmSFPASvMh04Y4G1arYs6IEKUlEDLYltoDkxFE09cR3nICk3QAn",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1611016186353-9af58c69a533?auto=format&fit=crop&w=1200&q=80"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const topCategories = [
    { name: "Lighting", icon: "lightbulb", delay: "0" },
    { name: "Interior", icon: "chair", delay: "50" },
    { name: "Audio", icon: "volume_up", delay: "100" },
    { name: "Care", icon: "cleaning_services", delay: "150" },
    { name: "Wheels", icon: "tire_repair", delay: "200" },
  ];

  const allCategories = [
    ...topCategories.map(c => ({ name: c.name, icon: c.icon })),
    { name: "Exterior", icon: "minor_crash" },
    { name: "Tech", icon: "memory" },
    { name: "Performance", icon: "speed" }
  ];

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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

  useEffect(() => {
    if (brandObj && !brandObj.models.includes(model)) {
      setModel(brandObj.models[0] || "");
    }
  }, [brand, brandObj, model]);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased font-display overflow-x-hidden pb-24">
      {/* Header with slide-down animation */}
      <header className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-4 fade-in duration-500">
        <div
          onClick={() => setShowSidebar(true)}
          className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </div>
        <h1 className="text-slate-900 dark:text-slate-100 text-xl font-extrabold leading-tight tracking-tight flex-1 text-center">
          <Link href="/">
            Wheelz<span className="text-primary">Cart</span>
          </Link>
        </h1>
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
        <section className="px-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both" style={{ animationDelay: '100ms' }}>
          <div className="relative flex flex-col justify-end overflow-hidden rounded-xl min-h-[320px] shadow-2xl group transition-transform duration-500 hover:scale-[1.02]">

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
            <div className="flex flex-col p-6 gap-4 relative z-10 transition-transform duration-500 group-hover:translate-y-[-4px]">
              <h2 className="text-white text-3xl font-extrabold leading-[1.1] tracking-tight">
                Everything Your <br />
                <span className="text-primary drop-shadow-[0_0_12px_rgba(19,127,236,0.6)] transition-all duration-300">Car Needs.</span> Delivered.
              </h2>
              <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-[280px]">
                Premium accessories curated for the modern Indian car owner.
              </p>
              <a href="/shop" className="flex pt-2">
                <button className="flex min-w-[140px] items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_8px_20px_-6px_rgba(19,127,236,0.6)] hover:-translate-y-1 active:translate-y-0 active:scale-95 shadow-lg shadow-primary/20">
                  <span>Browse Shop</span>
                </button>
              </a>
            </div>

            {/* Carousel dots indicators */}
            {/* <div className="absolute bottom-4 right-4 flex gap-1.5 z-20">
              {heroImages.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentHeroImage ? 'w-4 bg-primary' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </div> */}
          </div>
        </section>

        {/* Car Selector Section */}
        <section className="px-4 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both" style={{ animationDelay: '200ms' }}>
          <div className="bg-white dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-500 hover:shadow-md dark:hover:border-slate-700">
            <div className="items-center gap-2 mb-6 group cursor-pointer inline-flex">
              <span className="material-symbols-outlined text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                directions_car
              </span>
              <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold tracking-tight">
                Select Your Car
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="space-y-1.5 focus-within:-translate-y-0.5 transition-transform duration-300">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1 transition-colors">
                  Brand
                </label>
                <div className="relative group/select">
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full appearance-none bg-slate-100 dark:bg-slate-800 border-none rounded-lg h-12 px-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 transition-all duration-300 cursor-pointer group-hover/select:bg-slate-200 dark:group-hover/select:bg-slate-700/80"
                  >
                    {carList.map((car) => (
                      <option key={car.brand} value={car.brand}>{car.brand}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-slate-400 transition-transform duration-300 group-hover/select:translate-y-0.5">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                      {
                        brandObj?.models.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))
                      }
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-slate-400 transition-transform duration-300 group-hover/select:translate-y-0.5">
                      expand_more
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5 focus-within:-translate-y-0.5 transition-transform duration-300">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
                    Year
                  </label>
                  <div className="relative group/select">
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full appearance-none bg-slate-100 dark:bg-slate-800 border-none rounded-lg h-12 px-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 transition-all duration-300 cursor-pointer group-hover/select:bg-slate-200 dark:group-hover/select:bg-slate-700/80"
                    >
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                      <option value="2020">2020</option>
                      <option value="2019">2019</option>
                      <option value="2019">2019</option>
                      <option value="2018">2018</option>
                      <option value="2017">2017</option>
                      <option value="2016">2016</option>
                      <option value="2015">2015</option>
                      <option value="2014">2014</option>
                      <option value="2013">2013</option>
                      <option value="2012">2012</option>
                      <option value="2011">2011</option>
                      <option value="2010">2010</option>
                      <option value="2009">2009</option>
                      <option value="2008">2008</option>
                      <option value="2007">2007</option>
                      <option value="2006">2006</option>
                      <option value="2005">2005</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-slate-400 transition-transform duration-300 group-hover/select:translate-y-0.5">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              <div className="block w-full mt-2">
                <button onClick={() => router.push(`/shop?q=${brand} ${model}&year=${year}`)} className="w-full flex items-center justify-center gap-2 rounded-lg h-12 bg-primary/10 dark:bg-primary/20 text-primary text-base font-bold transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]">
                  <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:scale-110">search</span>
                  Find Products
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between px-4">
            <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold">
              Categories
            </h2>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="text-primary text-sm font-semibold transition-all duration-300 hover:text-blue-600 hover:underline active:opacity-70"
            >
              View All
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto px-4 pb-3 pt-1 hide-scrollbar scroll-smooth">
            {topCategories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => router.push(`/shop?category=${cat.name}`)}
                className={`flex flex-col items-center gap-2 shrink-0 group cursor-pointer animate-in fade-in zoom-in-95 duration-500 fill-mode-both`}
                style={{ animationDelay: `${350 + parseInt(cat.delay)}ms` }}
              >
                <div className="size-18 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-all duration-500 ease-out group-hover:scale-110 group-hover:border-primary/40 group-hover:shadow-[0_8px_20px_-6px_rgba(19,127,236,0.3)] group-active:scale-95">
                  <span className="material-symbols-outlined text-primary text-3xl transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6">
                    {cat.icon}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors group-hover:text-primary">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Accessories Section */}
        <section className="flex flex-col gap-4 px-4 pb-4 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both" style={{ animationDelay: '400ms' }}>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold">
            Popular Accessories
          </h2>
          <div className="grid grid-cols-2 gap-4">

            {/* Product Card 1 */}
            <div className="flex flex-col gap-2 group cursor-pointer overflow-hidden">
              <a
                href="/product?id=p7"
                className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 group-active:scale-[0.98]"
                style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
              >
                <img
                  className="w-full h-full rounded-xl object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  data-alt="Premium car floor mats in leather finish"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmEFaevuH4YiI99IR9uFOixy1Zul23j9SN7SyOSKYENsyRmDX8M_h4UjlHlFfwDDUfw7gzuvJU3l15r2-XWkfL6xnu4bRh-mFqSe8r5ZHBgXDj5Tk0UMb0ZSwA2Y15RlE5kr-QZ5ivE7E1V0HZbKvIARdpS8BWRxXmMmAeJMEE2krLMptfUAYzh8Nwtbs-gmsW3lPp8fmJ_Px3HYgA52f8Nj3csTHGCBPUN-i5bCCZpXAmuzpMsA8wH7dlJQAAV0IbiaWz415sXxd_"
                />
                {/* Gloss overlay effect */}
                <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay rotate-12 scale-[2]" />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist("p7");
                  }}
                  className="absolute top-2 right-2 size-8 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-white transition-all duration-300 hover:bg-white hover:text-red-500 hover:scale-110 active:scale-90"
                >
                  <span
                    className={`material-symbols-outlined text-sm transition-transform group-hover:scale-110 ${isInWishlist("p7") ? 'text-red-500' : ''}`}
                    style={{ fontVariationSettings: isInWishlist("p7") ? '"FILL" 1' : '"FILL" 0' }}
                  >
                    favorite
                  </span>
                </button>
              </a>
              <div className="transition-transform duration-300 group-hover:translate-x-1">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  Interior
                </p>
                <h3 className="text-slate-900 dark:text-slate-100 font-bold text-sm truncate group-hover:text-primary transition-colors">
                  Premium 7D Floor Mats
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-primary font-bold">₹4,999</span>
                  <div className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs text-yellow-500 fill-current">star</span>
                    <span className="text-[10px] font-bold">4.8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="flex flex-col gap-2 group cursor-pointer">
              <a
                href="/product?id=p8"
                className="block aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 group-active:scale-[0.98]"
                style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
              >
                <img
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  data-alt="Modern car dashboard camera system"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtU36nj21xRN0t73PaOhPpg7vLWGr0XV4jnEACqru-zFBzylkMYr8rQWC_1wS1vEW-dhjD9YpdH1yI7FSfwMIyGLZWGxxIL23ST8vh68Ubfec-rEUIKdYTNuPfUH0sZCAAkHEByRzCvgW_apCZFwwgtjggoodEe8vuFI6cMqtsuIn6cyqg4jj48n_DG9vYX_YLpHte4WBi--39ehjLiuQDdxL63USzI4TXuQKimnsotrKy6E40k-kJfLz2kWTOgn1uCvUPwIfueZhZ"
                />
                {/* Gloss overlay effect */}
                <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay rotate-12 scale-[2]" />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist("p8");
                  }}
                  className="absolute top-2 right-2 size-8 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-white transition-all duration-300 hover:bg-white hover:text-red-500 hover:scale-110 active:scale-90"
                >
                  <span
                    className={`material-symbols-outlined text-sm transition-transform group-hover:scale-110 ${isInWishlist("p8") ? 'text-red-500' : ''}`}
                    style={{ fontVariationSettings: isInWishlist("p8") ? '"FILL" 1' : '"FILL" 0' }}
                  >
                    favorite
                  </span>
                </button>
              </a>
              <div className="transition-transform duration-300 group-hover:translate-x-1">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  Tech
                </p>
                <h3 className="text-slate-900 dark:text-slate-100 font-bold text-sm truncate group-hover:text-primary transition-colors">
                  4K Dual Dash Camera
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-primary font-bold">₹8,499</span>
                  <div className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs text-yellow-500 fill-current">star</span>
                    <span className="text-[10px] font-bold">4.9</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      <TabNavbar active="home" />

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setShowCategoryModal(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-background-light dark:bg-background-dark sm:rounded-2xl rounded-t-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-full sm:slide-in-from-bottom-12 duration-500 ease-out fill-mode-both">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-b-full sm:hidden" />
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">All Categories</h2>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 active:scale-90"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-y-6 gap-x-2">
              {allCategories.map((cat, idx) => (
                <div
                  key={cat.name}
                  onClick={() => router.push(`/shop?category=${cat.name}`)}
                  className="flex flex-col items-center gap-2 group cursor-pointer animate-in fade-in zoom-in-95 duration-500 fill-mode-both"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="size-16 sm:size-18 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-all duration-500 ease-out group-hover:scale-110 group-hover:border-primary/40 group-hover:shadow-[0_8px_20px_-6px_rgba(19,127,236,0.3)] group-active:scale-95">
                    <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6">
                      {cat.icon}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 text-center transition-colors group-hover:text-primary leading-tight">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
              <button onClick={() => { setShowSidebar(false); setShowCategoryModal(true); }} className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors font-medium">
                <span className="material-symbols-outlined">category</span>
                Categories
              </button>
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
