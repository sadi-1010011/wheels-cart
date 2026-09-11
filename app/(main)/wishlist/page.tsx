"use client";

import { useWishlist } from "@/hooks/useWishlist";
import { useRouter } from "next/navigation";
import products from "@/data/products";
import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";

function WishlistContent() {
    const router = useRouter();
    const { wishlist, isLoaded } = useWishlist();

    const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

    if (!isLoaded) {
        return <div className="min-h-screen bg-background-light dark:bg-background-dark animate-pulse" />;
    }

    return (
        <main className="flex flex-col gap-4 p-4 md:p-8 pb-24">
            {wishlistedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-[15vh] px-8 animate-in fade-in zoom-in-95 duration-500 ease-out">
                    <div className="w-24 h-24 bg-red-50 dark:bg-red-900/10 text-red-300 dark:text-red-900/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: '"FILL" 1' }}>favorite</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Your wishlist is empty</h3>
                    <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-8 max-w-62.5">
                        Looks like you haven&apos;t added any wheels to your wishlist yet.
                    </p>
                    <button
                        onClick={() => router.push("/shop")}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm transition-all duration-300 shadow-lg shadow-primary/20 hover:-translate-y-1 active:scale-95 flex items-center gap-2 group"
                    >
                        <span>Explore Wheels</span>
                        <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {wishlistedProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            )}
        </main>
    );
}

export default function WishlistScreen() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-light dark:bg-background-dark animate-pulse" />}>
            <WishlistContent />
        </Suspense>
    );
}
