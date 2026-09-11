"use client";

import products from "@/data/products";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/hooks/useWishlist";
import Link from "next/link";
import { BrandIcon } from "@/components/BrandIcon";
import { SiWhatsapp } from "react-icons/si";

export default function Home() {
  const router = useRouter();
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
    "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&q=80",
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80",
    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=80",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
    <main className="flex flex-col gap-6 pb-24">
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
            <Link href="/shop" className="flex pt-2">
              <button className="flex min-w-35 items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_8px_20px_-6px_rgba(19,127,236,0.6)] hover:-translate-y-1 active:translate-y-0 active:scale-95 shadow-lg shadow-primary/20">
                <span>Browse Wheels</span>
              </button>
            </Link>
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

      {/* Quick Brand Filter Pills */}
      <section className="flex flex-col gap-4 px-0 md:px-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center justify-between px-4 md:px-0">
          <h2 className="text-slate-900 dark:text-slate-100 text-lg md:text-xl font-bold">
            Shop by Brand
          </h2>
        </div>

        <div className="flex gap-3 overflow-x-auto px-4 md:px-0 pb-3 pt-1 hide-scrollbar scroll-smooth">
          {brands.map((b, idx) => (
            <div
              key={b}
              onClick={() => router.push(`/shop?brand=${encodeURIComponent(b)}`)}
              className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer animate-in fade-in zoom-in-95 duration-500 fill-mode-both"
              style={{ animationDelay: `${350 + idx * 80}ms` }}
            >
              <div className="size-18 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-all duration-500 ease-out group-hover:scale-110 group-hover:border-primary/40 group-hover:shadow-[0_8px_20px_-6px_rgba(19,127,236,0.3)] group-active:scale-95">
                <span className="text-primary transition-transform duration-500 ease-out group-hover:scale-110 flex items-center justify-center">
                  <BrandIcon brand={b} className="w-9 h-9" />
                </span>
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors group-hover:text-primary">
                {b}
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
                      const params = new URLSearchParams({
                        item: product.name,
                        size: product.size,
                        pcd: product.pcd,
                        finish: product.finish,
                        price: product.price.toString(),
                        image: product.image
                      });
                      router.push(`/order?${params.toString()}`);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 h-8 mt-1 rounded-md bg-[#25D366]/10 text-[#128C7E] dark:text-[#25D366] text-xs font-extrabold tracking-wide transition-all duration-300 hover:bg-[#25D366] hover:text-white dark:hover:text-white active:scale-95 group-hover:bg-[#25D366] group-hover:text-white dark:group-hover:text-white group-hover:shadow-[0_4px_12px_rgba(37,211,102,0.3)]"
                  >
                    <SiWhatsapp className="text-[14px]" />
                    Enquire
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
