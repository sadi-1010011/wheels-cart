"use client";

import TabNavbar from "@/components/TabNavbar";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
import products, { Product } from "@/data/products";
import { useWishlist } from "@/hooks/useWishlist";

type PriceRange = "all" | "under1000" | "1000to3000" | "3000to5000" | "above5000";
type StockFilter = "all" | "inStock" | "outOfStock";

function ShopContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const categoryQuery = searchParams.get("category") || "all";
    const yearQuery = searchParams.get("year") || "all";
    const [searchQuery, setSearchQuery] = useState(query);

    // Filters
    const [categoryFilter, setCategoryFilter] = useState(categoryQuery);
    const [priceRange, setPriceRange] = useState<PriceRange>("all");
    const [stockFilter, setStockFilter] = useState<StockFilter>("all");
    const [brandFilter, setBrandFilter] = useState<string>("all");
    const [yearFilter, setYearFilter] = useState<string>(yearQuery);
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);
    const [showBrandDropdown, setShowBrandDropdown] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const availableYears = [2019, 2020, 2021, 2022, 2023, 2024];

    useEffect(() => {
        if (query) setSearchQuery(query);
    }, [query]);

    useEffect(() => {
        if (categoryQuery) setCategoryFilter(categoryQuery);
    }, [categoryQuery]);

    useEffect(() => {
        if (yearQuery) setYearFilter(yearQuery);
    }, [yearQuery]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handler = () => { setShowPriceDropdown(false); setShowBrandDropdown(false); };
        window.addEventListener("click", handler);
        return () => window.removeEventListener("click", handler);
    }, []);

    const { wishlist, isLoaded } = useWishlist();


    // Derive unique product brands for filter
    const productBrands = useMemo(() => {
        const set = new Set(products.map((p) => p.brand));
        return Array.from(set).sort();
    }, []);

    // Filter products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search query — match name, category, compatible brands/models
        if (searchQuery.trim()) {
            const terms = searchQuery.toLowerCase().split(/\s+/);
            result = result.filter((p) => {
                const searchable = [
                    p.name,
                    p.category,
                    p.brand,
                    ...p.compatibleBrands,
                    ...p.compatibleModels,
                ].join(" ").toLowerCase();
                return terms.every((t) => searchable.includes(t));
            });
        }

        // Price filter
        if (priceRange === "under1000") result = result.filter((p) => p.price < 1000);
        else if (priceRange === "1000to3000") result = result.filter((p) => p.price >= 1000 && p.price <= 3000);
        else if (priceRange === "3000to5000") result = result.filter((p) => p.price >= 3000 && p.price <= 5000);
        else if (priceRange === "above5000") result = result.filter((p) => p.price > 5000);

        // Stock filter
        if (stockFilter === "inStock") result = result.filter((p) => p.inStock);
        else if (stockFilter === "outOfStock") result = result.filter((p) => !p.inStock);

        // Brand filter
        if (brandFilter !== "all") result = result.filter((p) => p.brand === brandFilter);

        // Category filter
        if (categoryFilter !== "all") result = result.filter((p) => p.category === categoryFilter);

        // Year filter
        if (yearFilter !== "all") result = result.filter((p) => p.compatibleYears.includes(parseInt(yearFilter)));

        return result;
    }, [searchQuery, priceRange, stockFilter, brandFilter, categoryFilter, yearFilter]);

    const priceLabel: Record<PriceRange, string> = {
        all: "Price",
        under1000: "Under ₹1K",
        "1000to3000": "₹1K – ₹3K",
        "3000to5000": "₹3K – ₹5K",
        above5000: "Above ₹5K",
    };

    const activeFilters = (priceRange !== "all" ? 1 : 0) + (stockFilter !== "all" ? 1 : 0) + (brandFilter !== "all" ? 1 : 0) + (categoryFilter !== "all" ? 1 : 0) + (yearFilter !== "all" ? 1 : 0);

    const clearFilters = () => {
        setPriceRange("all");
        setStockFilter("all");
        setBrandFilter("all");
        setCategoryFilter("all");
        setYearFilter("all");
        if (categoryQuery || yearQuery) {
            router.replace('/shop');
        }
    };

    return ( 
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased font-display overflow-x-hidden pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-slate-200 dark:border-slate-800 animate-[fadeSlideDown_0.5s_ease-out_both]">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-90">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold leading-tight tracking-tight">
                        Shop
                    </h1>
                </div>
                <div className="flex items-center">
                    {isLoaded && wishlist.length > 0 && <button onClick={() => router.push("/wishlist")} className="relative p-2 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all duration-300 hover:scale-110 active:scale-90 group">
                        <span className="material-symbols-outlined group-hover:text-primary transition-colors">favorite</span>
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm shadow-primary/40 animate-pulse">
                            {wishlist.length}
                        </span>
                    </button>}
                </div>
            </header>

            {/* Search & Filter Bar */}
            <div className="relative z-40 flex flex-col gap-3 p-4 animate-[fadeSlideUp_0.6s_ease-out_0.1s_both]">
                <div className="relative w-full group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary duration-300">
                        search
                    </span>
                    <input
                        className="w-full rounded-xl border-none bg-slate-100 dark:bg-slate-800 py-3 pl-10 pr-10 text-sm focus:ring-2 focus:ring-primary outline-none transition-all duration-300"
                        placeholder="Search accessories, brands, models..."
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
                    {/* Category Token if Active */}
                    {categoryFilter !== "all" && (
                        <div className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-4 text-sm font-bold shadow-sm shadow-emerald-500/10">
                            <span className="material-symbols-outlined text-sm">category</span>
                            <span>{categoryFilter}</span>
                            <button onClick={() => { setCategoryFilter("all"); router.replace('/shop'); }} className="ml-1 flex items-center justify-center hover:text-emerald-800 transition-colors">
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                    )}

                    {/* Year Filter */}
                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowYearDropdown(!showYearDropdown); setShowPriceDropdown(false); setShowBrandDropdown(false); }}
                            className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-300 active:scale-95 ${
                                yearFilter !== "all"
                                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/10"
                                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                        >
                            <span>{yearFilter === "all" ? "Year" : yearFilter}</span>
                            <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${showYearDropdown ? "rotate-180" : ""}`}>expand_more</span>
                        </button>
                        {showYearDropdown && (
                            <div onClick={(e) => e.stopPropagation()} className="absolute top-12 left-0 z-50 min-w-[120px] rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-[scaleIn_0.2s_ease-out_both]">
                                <button
                                    onClick={() => { setYearFilter("all"); setShowYearDropdown(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${yearFilter === "all" ? "bg-primary/10 text-primary" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                                >
                                    All Years
                                </button>
                                {availableYears.slice().reverse().map((y) => (
                                    <button
                                        key={y}
                                        onClick={() => { setYearFilter(String(y)); setShowYearDropdown(false); }}
                                        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${yearFilter === String(y) ? "bg-primary/10 text-primary" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                                    >
                                        {y}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Price Filter */}
                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowPriceDropdown(!showPriceDropdown); setShowBrandDropdown(false); }}
                            className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-300 active:scale-95 ${
                                priceRange !== "all"
                                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/10"
                                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                        >
                            <span>{priceLabel[priceRange]}</span>
                            <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${showPriceDropdown ? "rotate-180" : ""}`}>expand_more</span>
                        </button>
                        {showPriceDropdown && (
                            <div onClick={(e) => e.stopPropagation()} className="absolute top-12 left-0 z-50 min-w-[160px] rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-[scaleIn_0.2s_ease-out_both]">
                                {(["all", "under1000", "1000to3000", "3000to5000", "above5000"] as PriceRange[]).map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => { setPriceRange(r); setShowPriceDropdown(false); }}
                                        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${priceRange === r ? "bg-primary/10 text-primary" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                                    >
                                        {priceLabel[r]}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Stock Status Toggle */}
                    {/* <button
                        onClick={() => setStockFilter(stockFilter === "all" ? "inStock" : stockFilter === "inStock" ? "outOfStock" : "all")}
                        className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-300 active:scale-95 ${
                            stockFilter !== "all"
                                ? "bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/10"
                                : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                    >
                        <span>{stockFilter === "all" ? "Stock Status" : stockFilter === "inStock" ? "In Stock" : "Out of Stock"}</span>
                        {stockFilter !== "all" && (
                            <span className={`h-2 w-2 rounded-full ${stockFilter === "inStock" ? "bg-emerald-500" : "bg-red-400"}`} />
                        )}
                    </button> */}

                    {/* Brand Filter */}
                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowBrandDropdown(!showBrandDropdown); setShowPriceDropdown(false); }}
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
                            <div onClick={(e) => e.stopPropagation()} className="absolute top-12 left-0 z-40 min-w-[160px] max-h-[240px] overflow-y-auto rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 animate-[scaleIn_0.2s_ease-out_both]">
                                <button
                                    onClick={() => { setBrandFilter("all"); setShowBrandDropdown(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${brandFilter === "all" ? "bg-primary/10 text-primary" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                                >
                                    All Brands
                                </button>
                                {productBrands.map((b) => (
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
            <div className="px-4 pb-2 animate-[fadeSlideUp_0.6s_ease-out_0.2s_both]">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
                    {searchQuery && <span className="text-primary"> for &quot;{searchQuery}&quot;</span>}
                </p>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 p-4 pt-0">
                    {filteredProducts.map((product, idx) => (
                        <ProductCard key={product.id} product={product} index={idx} router={router} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 px-8 animate-[fadeSlideUp_0.5s_ease-out_both]">
                    <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">search_off</span>
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">No products found</h3>
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

            {/* Sticky Bottom Nav Bar */}
            <TabNavbar active="shop" />
        </div>
    );
}

function ProductCard({ product, index, router }: { product: Product; index: number; router: ReturnType<typeof useRouter> }) {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const isWished = isInWishlist(product.id);
    
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div
            className="flex flex-col gap-3 group"
            style={{ animation: `fadeSlideUp 0.5s ease-out ${150 + index * 60}ms both` }}
        >
            <div
                onClick={() => router.push(`/product?id=${product.id}`)}
                className="relative w-full bg-slate-100 dark:bg-slate-800 aspect-square overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 group-active:scale-[0.98]"
                style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
            >
                <img
                    alt={product.name}
                    className="h-full w-full rounded-xl object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    src={product.image}
                />
                {/* Gloss overlay */}
                <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay rotate-12 scale-[2] pointer-events-none" />

                {/* Discount badge */}
                {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                        {discount}% OFF
                    </span>
                )}

                {/* Fav button */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                    }}
                    className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-white transition-all duration-300 hover:bg-white hover:text-red-500 hover:scale-110 active:scale-90"
                >
                    <span 
                        className={`material-symbols-outlined text-lg transition-colors ${isWished ? 'text-red-500 hover:text-red-600' : ''}`}
                        style={{ fontVariationSettings: isWished ? '"FILL" 1' : '"FILL" 0' }}
                    >
                        favorite
                    </span>
                </button>

                {/* Out of stock overlay */}
                {/* {!product.inStock && (
                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
                            Out of Stock
                        </span>
                    </div>
                )} */}
            </div>

            <div
                className="flex flex-col gap-1 transition-transform duration-300 group-hover:translate-x-1 cursor-pointer"
                onClick={() => router.push(`/product?id=${product.id}`)}
            >
                <h3 className="text-slate-900 dark:text-slate-100 text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                </h3>
                <div className="flex items-baseline gap-2">
                    <p className="text-primary text-base font-extrabold">₹{product.price.toLocaleString("en-IN")}</p>
                    {product.originalPrice && (
                        <p className="text-slate-400 text-xs line-through">₹{product.originalPrice.toLocaleString("en-IN")}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                            {product.shipsIn === "24 Hours" ? "Ships in 24h" : product.shipsIn}
                        </span>
                        {/* <div className="flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-yellow-500 text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                            <span className="text-[11px] font-bold">{product.rating}</span>
                        </div> */}
                    </div>
                    {/* <div className="flex items-center gap-1">
                        <span className={`h-1.5 w-1.5 rounded-full ${product.inStock ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
                        <span className={`text-[11px] font-medium ${product.inStock ? "text-emerald-500" : "text-red-400"}`}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default function ShopScreenWrapper() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-light dark:bg-background-dark" />}>
            <ShopContent />
        </Suspense>
    );
}