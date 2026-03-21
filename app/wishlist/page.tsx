"use client";

import { useWishlist } from "@/hooks/useWishlist";
import { useRouter } from "next/navigation";
import products from "@/data/products";
import TabNavbar from "@/components/TabNavbar";
import { Suspense } from "react";

function WishlistContent() {
    const router = useRouter();
    const { wishlist, toggleWishlist, isLoaded } = useWishlist();

    const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

    if (!isLoaded) {
        return <div className="min-h-screen bg-background-light dark:bg-background-dark animate-pulse" />;
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden pb-24">
            {/* Top Navigation */}
            <div className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-4 fade-in duration-500">
                <div onClick={() => router.back()} className="flex size-10 shrink-0 items-center justify-center cursor-pointer rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-110 active:scale-90">
                    <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">
                        arrow_back
                    </span>
                </div>
                <h2 className="ml-2 text-lg font-bold leading-tight tracking-tight flex-1">
                    My Wishlist
                </h2>
                <div className="flex w-10 items-center justify-end mr-2">
                    <span className="material-symbols-outlined text-primary text-xl">favorite</span>
                    <span className="absolute top-4.5 right-3 flex h-4 w-4 mr-2 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm shadow-primary/40 animate-pulse">
                        {wishlist.length}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-4 p-4">
                {wishlistedProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-[20vh] px-8 animate-in fade-in zoom-in-95 duration-500 ease-out">
                        <div className="w-24 h-24 bg-red-50 dark:bg-red-900/10 text-red-300 dark:text-red-900/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: '"FILL" 1' }}>favorite</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Your wishlist is empty</h3>
                        <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-8 max-w-[250px]">
                            Looks like you haven&apos;t added any items to your wishlist yet.
                        </p>
                        <button
                            onClick={() => router.push("/shop")}
                            className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm transition-all duration-300 shadow-lg shadow-primary/20 hover:-translate-y-1 active:scale-95 flex items-center gap-2 group"
                        >
                            <span>Explore Products</span>
                            <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {wishlistedProducts.map((product, index) => {
                            const discount = product.originalPrice
                                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                                : 0;

                            return (
                                <div
                                    key={product.id}
                                    className="flex flex-col gap-3 group animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out fill-mode-both"
                                    style={{ animationDelay: `${index * 100}ms` }}
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
                                        <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay rotate-12 scale-[2] pointer-events-none" />

                                        {discount > 0 && (
                                            <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                                                {discount}% OFF
                                            </span>
                                        )}

                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleWishlist(product.id);
                                            }}
                                            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/60 dark:bg-black/60 shadow-md backdrop-blur-md flex items-center justify-center text-red-500 transition-all duration-300 hover:bg-white hover:scale-110 active:scale-90"
                                        >
                                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: '"FILL" 1' }}>favorite</span>
                                        </button>
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
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <TabNavbar active="wishlist" />
        </div>
    );
}

export default function WishlistScreen() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-light dark:bg-background-dark animate-pulse" />}>
            <WishlistContent />
        </Suspense>
    );
}
