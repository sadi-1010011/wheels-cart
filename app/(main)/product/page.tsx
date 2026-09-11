"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import products from "@/data/products";
import { useWishlist } from "@/hooks/useWishlist";
import { SiWhatsapp } from "react-icons/si";

function ProductContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const product = products.find(p => p.id === id) || products[0];
    
    const { isInWishlist, toggleWishlist } = useWishlist();
    const isWished = isInWishlist(product.id);

    // Find compatible wheels (same PCD, different model)
    const compatibleWheels = products.filter(p => p.pcd === product.pcd && p.id !== product.id);

    const handleShare = async () => {
        const shareData = {
            title: product.name,
            text: `Check out ${product.name} at WheelzCart! Size: ${product.size}, PCD: ${product.pcd}`,
            url: window.location.href,
        };

        try {
            // Try fetching the image to share as a file directly
            const response = await fetch(product.image);
            const blob = await response.blob();
            const file = new File([blob], `${product.brand.toLowerCase()}-${product.model.toLowerCase()}-wheel.jpg`, { type: blob.type });

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
                window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`, '_blank');
            }
        } catch (err) {
            console.error("Error sharing", err);
        }
    };

    const handleWhatsAppOrder = async () => {
        const params = new URLSearchParams({
            item: product.name,
            size: product.size,
            pcd: product.pcd,
            finish: product.finish,
            price: product.price.toString(),
            image: product.image
        });
        router.push(`/order?${params.toString()}`);
    };

    return (
        <main className="flex-1 pb-32 md:pb-12 w-full">
            <header className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-4 fade-in duration-500">
                <div onClick={()=> router.back()} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer">
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </div>
                <h2 className="text-lg md:text-xl font-bold leading-tight tracking-tight flex-1 md:flex-none text-center">
                    Wheel Details
                </h2>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
                    <a href="/" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Home</a>
                    <a href="/shop" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Shop</a>
                    <a href="/wishlist" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Wishlist</a>
                </nav>

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
            
            <div className="md:pt-8 md:px-8">
                <div className="md:grid md:grid-cols-2 md:gap-12">
                    
                    {/* Left Column: Image Gallery */}
                    <div className="@container animate-in fade-in zoom-in-95 duration-700 ease-out fill-mode-both" style={{ animationDelay: '100ms' }}>
                        <div className="@[480px]:px-4 @[480px]:py-3 md:px-0 md:py-0 md:sticky md:top-24">
                            <div
                                className="relative group bg-cover bg-center flex flex-col justify-end overflow-hidden bg-slate-200 dark:bg-slate-800 @[480px]:rounded-xl md:rounded-2xl min-h-100 md:min-h-125 lg:min-h-150 transition-all duration-500 shadow-sm"
                            style={{
                                backgroundImage: `linear-gradient(0deg, rgba(16, 25, 34, 0.8) 0%, rgba(16, 25, 34, 0) 40%), url("${product.image}")`
                            }}
                        >
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm border border-white/20">
                                    {product.brand}
                                </span>
                                <span className="bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm">
                                    {product.size}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                    {/* Right Column: Product Details */}
                    <div className="flex flex-col">
                        {/* Product Header */}
                        <div className="px-4 md:px-0 pt-6 md:pt-0 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out fill-mode-both" style={{ animationDelay: '200ms' }}>
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
                    </div>
                    <h1 className="tracking-tight text-3xl font-extrabold leading-tight">
                        {product.name}
                    </h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        Premium alloy wheel designed for {product.brand} {product.model}. Size {product.size} with PCD {product.pcd}. {product.finish} finish for a stunning look.
                    </p>
                </div>

                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/50 my-6 animate-in fade-in duration-700 fill-mode-both" style={{ animationDelay: '300ms' }} />

                            {/* Specifications Card */}
                            <div className="px-4 md:px-0 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both" style={{ animationDelay: '400ms' }}>
                    <h3 className="text-lg font-bold mb-4">Specifications</h3>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Wheel Size</span>
                            <span className="text-sm font-bold">{product.size}</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">PCD / Bolt Pattern</span>
                            <span className="text-sm font-bold">{product.pcd}</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Compatible Car</span>
                            <span className="text-sm font-bold">{product.brand} {product.model}</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Finish</span>
                            <span className="text-sm font-bold">{product.finish}</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Material</span>
                            <span className="text-sm font-bold">Alloy</span>
                        </div>
                    </div>
                </div>

                            {/* Compatible Wheels Section */}
                            {compatibleWheels.length > 0 && (
                                <div className="px-4 md:px-0 mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both" style={{ animationDelay: '450ms' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Also Compatible ({product.pcd})</h3>
                        </div>
                        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                            {compatibleWheels.map((wheel) => (
                                <div
                                    key={wheel.id}
                                    onClick={() => router.push(`/product?id=${wheel.id}`)}
                                    className="shrink-0 w-32 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 group cursor-pointer"
                                >
                                    <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                                        <img src={wheel.image} alt={wheel.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                    <div className="p-2.5">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-primary transition-colors truncate">
                                            {wheel.brand}
                                        </p>
                                        <p className="text-xs font-bold truncate mt-0.5">{wheel.model}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                            {/* Highlights */}
                            <div className="px-4 md:px-0 mt-8 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both" style={{ animationDelay: '500ms' }}>
                    <h3 className="text-lg font-bold mb-4">Highlights</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/40 transition-all duration-300 hover:bg-primary/5 hover:border-primary/20 cursor-pointer group">
                            <span className="material-symbols-outlined text-primary transition-transform duration-300 group-hover:scale-110">precision_manufacturing</span>
                            <span className="text-sm font-medium group-hover:text-primary transition-colors">Precision Engineered</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/40 transition-all duration-300 hover:bg-primary/5 hover:border-primary/20 cursor-pointer group">
                            <span className="material-symbols-outlined text-primary transition-transform duration-300 group-hover:scale-110">verified_user</span>
                            <span className="text-sm font-medium group-hover:text-primary transition-colors">1 Year Warranty</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/40 transition-all duration-300 hover:bg-primary/5 hover:border-primary/20 cursor-pointer group">
                            <span className="material-symbols-outlined text-primary transition-transform duration-300 group-hover:scale-110">package_2</span>
                            <span className="text-sm font-medium group-hover:text-primary transition-colors">Heavy-Duty Packaging</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/40 transition-all duration-300 hover:bg-primary/5 hover:border-primary/20 cursor-pointer group">
                            <span className="material-symbols-outlined text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12">construction</span>
                            <span className="text-sm font-medium group-hover:text-primary transition-colors">Easy Install</span>
                        </div>
                    </div>
                </div>
                            {/* Desktop CTA */}
                            <div className="hidden md:flex gap-3 mt-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                                <button onClick={handleWhatsAppOrder} className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl bg-[#25D366]/10 text-[#128C7E] dark:text-[#25D366] transition-all duration-300 hover:bg-[#25D366] hover:text-white dark:hover:text-white active:scale-[0.98] group hover:shadow-[0_8px_20px_-6px_rgba(37,211,102,0.5)]">
                                    <SiWhatsapp className="text-[24px] transition-transform duration-300 group-hover:scale-110" />
                                    <span className="font-extrabold tracking-wide text-lg">ENQUIRE ON WHATSAPP</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

            {/* Mobile Sticky CTA */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 px-4 pt-4 pb-8 animate-in slide-in-from-bottom-full duration-500 ease-out shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <div className="flex gap-3 mb-4">
                    <button onClick={handleWhatsAppOrder} className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl bg-[#25D366]/10 text-[#128C7E] dark:text-[#25D366] transition-all duration-300 hover:bg-[#25D366] hover:text-white dark:hover:text-white active:scale-[0.98] group hover:shadow-[0_8px_20px_-6px_rgba(37,211,102,0.5)]">
                        <SiWhatsapp className="text-[24px] transition-transform duration-300 group-hover:scale-110" />
                        <span className="font-extrabold tracking-wide text-lg">ENQUIRE ON WHATSAPP</span>
                    </button>
                </div>
            </div>
        </main>
    );
}

export default function ProductScreen() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-light dark:bg-background-dark" />}>
            <ProductContent />
        </Suspense>
    );
}