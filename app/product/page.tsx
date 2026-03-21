"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import products from "@/data/products";
import { useWishlist } from "@/hooks/useWishlist";

function ProductContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const product = products.find(p => p.id === id) || products[6]; // default to Seat Cover if no ID
    
    const { isInWishlist, toggleWishlist } = useWishlist();
    const isWished = isInWishlist(product.id);

    const discount = product.originalPrice 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
        : 0;

    const handleShare = async () => {
        const shareData = {
            title: product.name,
            text: `Check out ${product.name} at WheelzCart!`,
            url: window.location.href,
        };

        try {
            // Try fetching the image to share as a file directly (great for WhatsApp/FB previews on mobile)
            const response = await fetch(product.image);
            const blob = await response.blob();
            const file = new File([blob], 'product.jpg', { type: blob.type });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ ...shareData, files: [file] });
                return;
            }
        } catch (err) {
            console.log("Native image sharing fallback", err);
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback for desktops without native share
                window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`, '_blank');
            }
        } catch (err) {
            console.error("Error sharing", err);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden">
            <header className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-4 fade-in duration-500">
                <div onClick={()=> router.back()} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer">
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </div>
                <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">
                    Product Details
                </h2>
                <div className="flex gap-2 items-center justify-end">
                    <button 
                        onClick={() => toggleWishlist(product.id)}
                        className="flex size-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-90"
                    >
                        <span 
                            className={`material-symbols-outlined transition-colors ${isWished ? 'text-red-500 hover:text-red-600' : 'text-slate-900 dark:text-slate-100'}`}
                            style={{ fontVariationSettings: isWished ? '"FILL" 1' : '"FILL" 0' }}
                        >
                            favorite
                        </span>
                    </button>
                    <button onClick={handleShare} className="flex size-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:text-primary active:scale-90 text-slate-900 dark:text-slate-100">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                </div>
            </header>
            
            <main className="flex-1 pb-32 mb-12">
                {/* Image Gallery */}
                <div className="@container animate-in fade-in zoom-in-95 duration-700 ease-out fill-mode-both" style={{ animationDelay: '100ms' }}>
                    <div className="@[480px]:px-4 @[480px]:py-3">
                        <div
                            className="relative group bg-cover bg-center flex flex-col justify-end overflow-hidden bg-slate-200 dark:bg-slate-800 @[480px]:rounded-xl min-h-[400px] transition-all duration-500 shadow-sm"
                            style={{
                                backgroundImage: `linear-gradient(0deg, rgba(16, 25, 34, 0.8) 0%, rgba(16, 25, 34, 0) 40%), url("${product.image}")`
                            }}
                        >
                            {/* <button className="absolute top-4 right-4 bg-background-dark/50 backdrop-blur-sm p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 group-hover:bg-primary/50">
                                <span className="material-symbols-outlined text-white transition-transform duration-300 group-hover:scale-110">
                                    zoom_in
                                </span>
                            </button> */}
                            <div className="absolute top-4 left-4">
                                <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm border border-white/20">
                                    {product.brand}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Header */}
                <div className="px-4 pt-6 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out fill-mode-both" style={{ animationDelay: '200ms' }}>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {product.inStock ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-500 ring-1 ring-inset ring-green-500/20 shadow-[0_0_12px_rgba(34,197,94,0.1)]">
                                <span className="material-symbols-outlined text-xs animate-pulse">check_circle</span> In Stock
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-500 ring-1 ring-inset ring-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.1)]">
                                <span className="material-symbols-outlined text-xs">cancel</span> Out of Stock
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20 shadow-[0_0_12px_rgba(19,127,236,0.1)]">
                            <span className="material-symbols-outlined text-xs">local_shipping</span> {product.shipsIn}
                        </span>
                        {/* <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-semibold text-yellow-600 dark:text-yellow-500 ring-1 ring-inset ring-yellow-500/20">
                            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: '"FILL" 1' }}>star</span> {product.rating}
                        </span> */}
                    </div>
                    <h1 className="tracking-tight text-3xl font-extrabold leading-tight">
                        {product.name}
                    </h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        Premium {product.category.toLowerCase()} accessory designed for perfect fit and long-lasting durability. Manufactured by {product.brand}.
                    </p>
                    <div className="mt-6 flex items-baseline gap-2 group">
                        <span className="text-3xl font-bold transition-colors duration-300 group-hover:text-primary">
                            ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        {product.originalPrice && (
                            <>
                                <span className="text-lg text-slate-500 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                                <span className="text-sm font-bold text-primary animate-pulse bg-primary/10 px-2 py-0.5 rounded-full">{discount}% OFF</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/50 my-6 animate-in fade-in duration-700 fill-mode-both" style={{ animationDelay: '300ms' }} />

                {/* Compatibility Section */}
                <div className="px-4 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Compatible With</h3>
                    </div>
                    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                        {product.compatibleBrands.slice(0, 4).map((brand) => (
                            <div key={brand} className="shrink-0 w-28 rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-900/40 transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 group">
                                <div className="h-8 w-full flex items-center justify-center mb-2 text-primary">
                                    <span className="material-symbols-outlined text-3xl transition-transform duration-300 group-hover:scale-110">directions_car</span>
                                </div>
                                <p className="text-center font-bold text-xs uppercase tracking-wider text-slate-500 transition-colors group-hover:text-primary truncate">
                                    {brand}
                                </p>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        Fits specific models: {product.compatibleModels.join(", ")}
                    </p>
                </div>

                {/* Features */}
                <div className="px-4 mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both" style={{ animationDelay: '500ms' }}>
                    <h3 className="text-lg font-bold mb-4">Highlights</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/40 transition-all duration-300 hover:bg-primary/5 hover:border-primary/20 cursor-pointer group">
                            <span className="material-symbols-outlined text-primary transition-transform duration-300 group-hover:scale-110">workspace_premium</span>
                            <span className="text-sm font-medium group-hover:text-primary transition-colors">Premium Quality</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/40 transition-all duration-300 hover:bg-primary/5 hover:border-primary/20 cursor-pointer group">
                            <span className="material-symbols-outlined text-primary transition-transform duration-300 group-hover:scale-110">verified_user</span>
                            <span className="text-sm font-medium group-hover:text-primary transition-colors">1 Year Warranty</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/40 transition-all duration-300 hover:bg-primary/5 hover:border-primary/20 cursor-pointer group">
                            <span className="material-symbols-outlined text-primary transition-transform duration-300 group-hover:scale-110">package_2</span>
                            <span className="text-sm font-medium group-hover:text-primary transition-colors">Secure Box</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/40 transition-all duration-300 hover:bg-primary/5 hover:border-primary/20 cursor-pointer group">
                            <span className="material-symbols-outlined text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12">construction</span>
                            <span className="text-sm font-medium group-hover:text-primary transition-colors">Easy Install</span>
                        </div>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 z-50 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 px-4 pt-4 pb-8 animate-in slide-in-from-bottom-full duration-500 ease-out shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <div className="flex gap-3 mb-4">
                    <a href={`https://wa.me/916238998062?text=Hi! I'm interested in this product: ${window.location.href}`} className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border border-primary/30 text-primary bg-primary/5 transition-all duration-300 hover:bg-primary/10 hover:shadow-md hover:shadow-primary/10 active:scale-[0.98] group">
                        <span className="material-symbols-outlined transition-transform duration-300 group-hover:scale-110">forum</span>
                        <span className="font-bold">WhatsApp</span>
                    </a>
                    <button 
                        disabled={!product.inStock}
                        onClick={()=> router.push(`/order?item=${encodeURIComponent(product.name)}&qty=1`)} 
                        className={`flex-[1.5] flex items-center justify-center gap-2 h-12 rounded-xl text-white shadow-lg transition-all duration-300 active:scale-[0.98] group ${product.inStock ? "bg-primary shadow-primary/20 hover:bg-blue-600 hover:shadow-[0_8px_20px_-6px_rgba(19,127,236,0.5)] hover:-translate-y-0.5 active:translate-y-0.5" : "bg-slate-400 dark:bg-slate-600 cursor-not-allowed opacity-70"}`}
                    >
                        <span className="material-symbols-outlined transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12">
                            {product.inStock ? 'shopping_cart_checkout' : 'remove_shopping_cart'}
                        </span>
                        <span className="font-extrabold tracking-wide">
                            {product.inStock ? 'REQUEST ORDER' : 'OUT OF STOCK'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ProductScreen() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-light dark:bg-background-dark" />}>
            <ProductContent />
        </Suspense>
    );
}