"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
import products from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

type PriceRange = "all" | "under6000" | "6000to10000" | "10000to15000" | "above15000";

function ShopContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const brandQuery = searchParams.get("brand") || "all";
    const modelQuery = searchParams.get("model") || "all";
    const sizeQuery = searchParams.get("size") || "all";
    const [searchQuery, setSearchQuery] = useState(query);

    // Filters
    const [brandFilter, setBrandFilter] = useState(brandQuery);
    const [modelFilter, setModelFilter] = useState(modelQuery);
    const [sizeFilter, setSizeFilter] = useState(sizeQuery);
    const [pcdFilter, setPcdFilter] = useState<string>("all");
    const [priceRange, setPriceRange] = useState<PriceRange>("all");
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);
    const [showBrandDropdown, setShowBrandDropdown] = useState(false);
    const [showSizeDropdown, setShowSizeDropdown] = useState(false);
    const [showPcdDropdown, setShowPcdDropdown] = useState(false);

    useEffect(() => {
        if (query) setSearchQuery(query);
    }, [query]);

    useEffect(() => {
        if (brandQuery !== "all") setBrandFilter(brandQuery);
    }, [brandQuery]);

    useEffect(() => {
        if (modelQuery !== "all") setModelFilter(modelQuery);
    }, [modelQuery]);

    useEffect(() => {
        if (sizeQuery !== "all") setSizeFilter(sizeQuery);
    }, [sizeQuery]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handler = () => { setShowPriceDropdown(false); setShowBrandDropdown(false); setShowSizeDropdown(false); setShowPcdDropdown(false); };
        window.addEventListener("click", handler);
        return () => window.removeEventListener("click", handler);
    }, []);

    // Unique values for filters
    const availableBrands = useMemo(() => [...new Set(products.map(p => p.brand))].sort(), []);
    const availableSizes = useMemo(() => [...new Set(products.map(p => p.size))].sort((a, b) => parseInt(a) - parseInt(b)), []);
    const availablePcds = useMemo(() => [...new Set(products.map(p => p.pcd))].sort(), []);

    // Filter products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search query — match name, brand, model, size, pcd
        if (searchQuery.trim()) {
            const terms = searchQuery.toLowerCase().split(/\s+/);
            result = result.filter((p) => {
                const searchable = [
                    p.name,
                    p.brand,
                    p.model,
                    p.size,
                    p.pcd,
                    p.finish,
                ].join(" ").toLowerCase();
                return terms.every((t) => searchable.includes(t));
            });
        }

        // Brand filter
        if (brandFilter !== "all") result = result.filter((p) => p.brand === brandFilter);

        // Model filter
        if (modelFilter !== "all") result = result.filter((p) => p.model === modelFilter);

        // Size filter
        if (sizeFilter !== "all") result = result.filter((p) => p.size === sizeFilter);

        // PCD filter
        if (pcdFilter !== "all") result = result.filter((p) => p.pcd === pcdFilter);

        // Price filter
        if (priceRange === "under6000") result = result.filter((p) => p.price < 6000);
        else if (priceRange === "6000to10000") result = result.filter((p) => p.price >= 6000 && p.price <= 10000);
        else if (priceRange === "10000to15000") result = result.filter((p) => p.price >= 10000 && p.price <= 15000);
        else if (priceRange === "above15000") result = result.filter((p) => p.price > 15000);

        return result;
    }, [searchQuery, brandFilter, modelFilter, sizeFilter, pcdFilter, priceRange]);

    const activeFilters = (priceRange !== "all" ? 1 : 0) + (brandFilter !== "all" ? 1 : 0) + (sizeFilter !== "all" ? 1 : 0) + (pcdFilter !== "all" ? 1 : 0) + (modelFilter !== "all" ? 1 : 0);

    const clearFilters = () => {
        setPriceRange("all");
        setBrandFilter("all");
        setModelFilter("all");
        setSizeFilter("all");
        setPcdFilter("all");
        if (brandQuery !== "all" || sizeQuery !== "all" || modelQuery !== "all") {
            router.replace('/shop');
        }
    };

    return ( 
        <main className="flex flex-col w-full pb-20">
            {/* Search & Filter Bar */}
            <div className="relative z-40 flex flex-col gap-3 p-4 md:px-8 animate-[fadeSlideUp_0.6s_ease-out_0.1s_both]">
                <div className="relative w-full group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary duration-300">
                        search
                    </span>
                    <input
                        className="w-full rounded-xl border-none bg-slate-100 dark:bg-slate-800 py-3 pl-10 pr-10 text-sm focus:ring-2 focus:ring-primary outline-none transition-all duration-300"
                        placeholder="Search wheels by brand, model, size..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    )}
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap gap-2 pb-1 relative">
                    {/* Active model token */}
                    {modelFilter !== "all" && (
                        <div className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-4 text-sm font-bold shadow-sm shadow-emerald-500/10">
                            <span className="material-symbols-outlined text-sm">directions_car</span>
                            <span>{modelFilter}</span>
                            <button onClick={() => { setModelFilter("all"); router.replace('/shop'); }} className="ml-1 flex items-center justify-center hover:text-emerald-800 transition-colors">
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                    )}

                    {/* Brand Filter */}
                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowBrandDropdown(!showBrandDropdown); setShowPriceDropdown(false); setShowSizeDropdown(false); setShowPcdDropdown(false); }}
                            className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-300 active:scale-95 ${
                                brandFilter !== "all"
                                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/10"
                                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                        >
                            <span>{brandFilter === "all" ? "Brand" : brandFilter}</span>
                            <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${showBrandDropdown ? "rotate-180" : ""}`}>expand_more</span>
                        </button>
                        {showBrandDropdown && (
                            <div onClick={(e) => e.stopPropagation()} className="absolute top-12 left-0 z-50 min-w-40 max-h-60 overflow-y-auto rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 animate-[scaleIn_0.2s_ease-out_both]">
                                <button
                                    onClick={() => { setBrandFilter("all"); setShowBrandDropdown(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${brandFilter === "all" ? "bg-primary/10 text-primary" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                                >
                                    All Brands
                                </button>
                                {availableBrands.map((b) => (
                                    <button
                                        key={b}
                                        onClick={() => { setBrandFilter(b); setShowBrandDropdown(false); }}
                                        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${brandFilter === b ? "bg-primary/10 text-primary" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                                    >
                                        {b}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Size Filter */}
                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowSizeDropdown(!showSizeDropdown); setShowPriceDropdown(false); setShowBrandDropdown(false); setShowPcdDropdown(false); }}
                            className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-300 active:scale-95 ${
                                sizeFilter !== "all"
                                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/10"
                                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                        >
                            <span>{sizeFilter === "all" ? "Size" : sizeFilter}</span>
                            <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${showSizeDropdown ? "rotate-180" : ""}`}>expand_more</span>
                        </button>
                        {showSizeDropdown && (
                            <div onClick={(e) => e.stopPropagation()} className="absolute top-12 left-0 z-50 min-w-30 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-[scaleIn_0.2s_ease-out_both]">
                                <button
                                    onClick={() => { setSizeFilter("all"); setShowSizeDropdown(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${sizeFilter === "all" ? "bg-primary/10 text-primary" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                                >
                                    All Sizes
                                </button>
                                {availableSizes.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => { setSizeFilter(s); setShowSizeDropdown(false); }}
                                        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${sizeFilter === s ? "bg-primary/10 text-primary" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* PCD Filter */}
                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowPcdDropdown(!showPcdDropdown); setShowPriceDropdown(false); setShowBrandDropdown(false); setShowSizeDropdown(false); }}
                            className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-300 active:scale-95 ${
                                pcdFilter !== "all"
                                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/10"
                                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                        >
                            <span>{pcdFilter === "all" ? "PCD" : pcdFilter}</span>
                            <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${showPcdDropdown ? "rotate-180" : ""}`}>expand_more</span>
                        </button>
                        {showPcdDropdown && (
                            <div onClick={(e) => e.stopPropagation()} className="absolute top-12 left-0 z-50 min-w-30 max-h-60 overflow-y-auto rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 animate-[scaleIn_0.2s_ease-out_both]">
                                <button
                                    onClick={() => { setPcdFilter("all"); setShowPcdDropdown(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${pcdFilter === "all" ? "bg-primary/10 text-primary" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                                >
                                    All PCDs
                                </button>
                                {availablePcds.map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => { setPcdFilter(p); setShowPcdDropdown(false); }}
                                        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${pcdFilter === p ? "bg-primary/10 text-primary" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Clear Filters */}
                    {activeFilters > 0 && (
                        <button
                            onClick={clearFilters}
                            className="flex h-10 shrink-0 items-center justify-center px-3 gap-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 transition-all duration-300 active:scale-95 text-sm font-semibold animate-[scaleIn_0.2s_ease-out_both]"
                        >
                            <span className="material-symbols-outlined text-base">close</span>
                            <span>Clear ({activeFilters})</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Results Count Badge */}
            <div className="px-4 md:px-8 pb-2 animate-[fadeSlideUp_0.6s_ease-out_0.2s_both]">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {filteredProducts.length} {filteredProducts.length === 1 ? "wheel" : "wheels"} found
                    {searchQuery && <span className="text-primary"> for &quot;{searchQuery}&quot;</span>}
                </p>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 p-4 md:px-8 pt-0">
                    {filteredProducts.map((product, idx) => (
                        <div key={product.id} style={{ animation: `fadeSlideUp 0.5s ease-out ${100 + idx * 60}ms both` }}>
                            <ProductCard product={product} index={0} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 px-8 animate-[fadeSlideUp_0.5s_ease-out_both]">
                    <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">search_off</span>
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">No wheels found</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
                        Try adjusting your search or filters to find what you&apos;re looking for.
                    </p>
                    <button
                        onClick={() => { setSearchQuery(""); clearFilters(); }}
                        className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
        </main>
    );
}

export default function ShopScreenWrapper() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-light dark:bg-background-dark" />}>
            <ShopContent />
        </Suspense>
    );
}