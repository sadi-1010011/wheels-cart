"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function OrderForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const item = searchParams.get("item") || "Wheel";
    const initialQty = searchParams.get("qty") ? parseInt(searchParams.get("qty") as string) : 1;
    const size = searchParams.get("size") || "";
    const pcd = searchParams.get("pcd") || "";
    const finish = searchParams.get("finish") || "";
    const price = searchParams.get("price") ? parseInt(searchParams.get("price") as string) : 0;
    const image = searchParams.get("image") || "";

    const [qty, setQty] = useState(initialQty);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        whatsapp: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [isWhatsappSameAsPhone, setIsWhatsappSameAsPhone] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleQtyChange = (delta: number) => {
        setQty((prev) => Math.max(1, Math.min(10, prev + delta)));
    };

    const handleSubmit = async () => {
        const isFormValid = formData.fullName && formData.phone && formData.address && formData.city && formData.state && formData.pincode;

        if (!isFormValid) {
            alert("Please fill in all required fields before submitting.");
            return;
        }

        const finalWhatsapp = isWhatsappSameAsPhone ? formData.phone : formData.whatsapp;
        if (!isWhatsappSameAsPhone && !formData.whatsapp) {
            alert("Please enter your WhatsApp number.");
            return;
        }

        // Build formatted message
        const message = `*NEW ORDER REQUEST* 🛒\n\n*Wheel:* ${item}\n*Size:* ${size}\n*PCD:* ${pcd}\n*Finish:* ${finish}\n*Quantity:* ${qty}\n*Total Price:* ₹${(price * qty).toLocaleString("en-IN")}\n\n*Customer Details:*\n*Name:* ${formData.fullName}\n*Phone:* +91 ${formData.phone}\n*WhatsApp:* +91 ${finalWhatsapp}\n*Address:* ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`;

        try {
            // Try sharing with image via Web Share API
            if (image) {
                const response = await fetch(image);
                const blob = await response.blob();
                const file = new File([blob], `order-${item.replace(/[^a-zA-Z0-9]/g, '-')}.jpg`, { type: blob.type });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        text: message,
                        files: [file],
                    });
                    
                    // Show success UI and redirect
                    setShowSuccess(true);
                    setTimeout(() => {
                        router.push("/home");
                    }, 3000);
                    return;
                }
            }
        } catch (err) {
            console.log("Image share fallback", err);
        }

        // Fallback: Open WhatsApp directly
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/916238998062?text=${encodedMessage}`, '_blank');

        // Show success UI and redirect
        setShowSuccess(true);
        setTimeout(() => {
            router.push("/home");
        }, 3000);
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col  bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden">
            {/* Top Navigation */}
            <div className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-4 fade-in duration-500">
                <div onClick={() => router.back()} className="flex size-10 shrink-0 items-center justify-center cursor-pointer rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-110 active:scale-90 md:hidden">
                    <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">
                        arrow_back
                    </span>
                </div>
                <h2 className="ml-2 text-lg md:text-xl font-bold leading-tight tracking-tight flex-1 text-center md:text-left">
                    Order Request Form
                </h2>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex flex-1 items-center justify-end gap-8 pr-4">
                    <a href="/" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Home</a>
                    <a href="/shop" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Shop</a>
                </nav>
            </div>

            <div className="md:grid md:grid-cols-2 md:gap-8 md:p-8 md:max-w-6xl md:mx-auto w-full">
                {/* Right Column: Order Summary */}
                <div className="flex flex-col gap-4 p-4 md:px-0 md:pt-4 order-1 md:order-2 md:sticky md:top-24 h-fit">
                    {/* Notification Banner */}
                    <div className="animate-in fade-in zoom-in-95 duration-700 ease-out fill-mode-both" style={{ animationDelay: '100ms' }}>
                <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-primary/30 bg-primary/10 p-5 @[480px]:flex-row @[480px]:items-center transition-all duration-300 hover:shadow-md hover:border-primary/50">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-xl animate-pulse">
                                verified_user
                            </span>
                            <p className="text-slate-900 dark:text-white text-base font-bold leading-tight">
                                No payment required
                            </p>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">
                            We will confirm stock availability before requesting any payment via WhatsApp.
                        </p>
                    </div>
                </div>

                {/* Selected Product Summary */}
                <div className="mt-4 flex flex-col items-start gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-4 transition-all duration-300 hover:shadow-sm">
                    <div className="flex w-full gap-4">
                        {image && (
                            <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                                <img src={image} alt={item} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex flex-col justify-center flex-1">
                            <p className="font-bold text-base text-slate-900 dark:text-white leading-tight mb-1">{item}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {size && <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{size}</span>}
                                {pcd && <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{pcd}</span>}
                            </div>
                            <p className="font-bold text-primary text-lg">₹{(price * qty).toLocaleString("en-IN")}</p>
                        </div>
                    </div>
                    
                    {/* Quantity Selector */}
                    <div className="w-full flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Quantity</span>
                        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                            <button 
                                onClick={() => handleQtyChange(-1)} 
                                disabled={qty <= 1}
                                className="w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-slate-900 shadow-sm text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                            >
                                <span className="material-symbols-outlined text-sm">remove</span>
                            </button>
                            <span className="w-6 text-center font-bold text-slate-900 dark:text-white">{qty}</span>
                            <button 
                                onClick={() => handleQtyChange(1)} 
                                disabled={qty >= 10}
                                className="w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-slate-900 shadow-sm text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                            >
                                <span className="material-symbols-outlined text-sm">add</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

                    {/* Desktop CTA (Rendered in Right Column) */}
                    <div className="hidden md:block w-full mt-4 border-t border-slate-200 dark:border-slate-800 pt-6">
                        <button
                            onClick={handleSubmit}
                            className="flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-xl h-14 bg-primary text-white text-base font-bold leading-normal transition-all duration-300 hover:bg-blue-600 hover:shadow-[0_8px_20px_-6px_rgba(19,127,236,0.5)] hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] group"
                        >
                            <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">send</span>
                            <span className="truncate uppercase tracking-wide">
                                Submit Order Request
                            </span>
                        </button>
                        <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-500">
                            You will be redirected to WhatsApp to confirm order.
                        </p>
                    </div>
                </div>

                {/* Left Column: Form Content */}
                <div className="flex flex-col gap-2 px-4 md:px-0 pt-4 pb-32 md:pb-8 order-2 md:order-1">
                {/* Full Name */}
                <div className="py-2 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both" style={{ animationDelay: '150ms' }}>
                    <label className="flex flex-col w-full group">
                        <p className="text-slate-700 dark:text-slate-300 text-sm font-semibold leading-normal pb-2 uppercase tracking-wider transition-colors group-focus-within:text-primary">
                            Full Name
                        </p>
                        <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="form-input flex w-full rounded-lg text-slate-900 dark:text-white border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 placeholder:text-slate-400 dark:placeholder:text-slate-600 px-4 text-base transition-all duration-300 outline-none hover:border-slate-400 dark:hover:border-slate-600"
                            placeholder="Enter your full name"
                        />
                    </label>
                </div>

                {/* Contact Row */}
                <div className="flex flex-col gap-4 py-2 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both" style={{ animationDelay: '200ms' }}>
                    <label className="flex flex-col w-full group">
                        <p className="text-slate-700 dark:text-slate-300 text-sm font-semibold leading-normal pb-2 uppercase tracking-wider transition-colors group-focus-within:text-primary">
                            Phone Number
                        </p>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 transition-colors group-focus-within:text-primary">
                                +91
                            </span>
                            <input
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                maxLength={10}
                                className="form-input flex w-full rounded-lg text-slate-900 dark:text-white border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 placeholder:text-slate-400 dark:placeholder:text-slate-600 pl-12 pr-4 text-base transition-all duration-300 outline-none hover:border-slate-400 dark:hover:border-slate-600"
                                placeholder="98765 43210"
                            />
                        </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer w-fit select-none">
                        <input
                            type="checkbox"
                            checked={isWhatsappSameAsPhone}
                            onChange={(e) => setIsWhatsappSameAsPhone(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">WhatsApp number is same as Phone number</span>
                    </label>

                    {!isWhatsappSameAsPhone && (
                        <label className="flex flex-col w-full group mt-2 animate-in slide-in-from-top-2 fade-in duration-300">
                            <p className="text-slate-700 dark:text-slate-300 text-sm font-semibold leading-normal pb-2 uppercase tracking-wider transition-colors group-focus-within:text-primary">
                                WhatsApp Number
                            </p>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 transition-colors group-focus-within:text-primary">
                                    +91
                                </span>
                                <input
                                    name="whatsapp"
                                    type="tel"
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                    maxLength={10}
                                    className="form-input flex w-full rounded-lg text-slate-900 dark:text-white border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 placeholder:text-slate-400 dark:placeholder:text-slate-600 pl-12 pr-4 text-base transition-all duration-300 outline-none hover:border-slate-400 dark:hover:border-slate-600"
                                    placeholder="98765 43210"
                                />
                            </div>
                        </label>
                    )}
                </div>

                {/* Address */}
                <div className="py-2 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both" style={{ animationDelay: '250ms' }}>
                    <label className="flex flex-col w-full group">
                        <p className="text-slate-700 dark:text-slate-300 text-sm font-semibold leading-normal pb-2 uppercase tracking-wider transition-colors group-focus-within:text-primary">
                            Full Address
                        </p>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="form-input flex w-full rounded-lg text-slate-900 dark:text-white border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-30 placeholder:text-slate-400 dark:placeholder:text-slate-600 p-4 text-base resize-none transition-all duration-300 outline-none hover:border-slate-400 dark:hover:border-slate-600"
                            placeholder="House No, Building, Street, Landmark"
                        />
                    </label>
                </div>

                {/* Location Details Row */}
                <div className="flex flex-col md:flex-row gap-4 py-2 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both" style={{ animationDelay: '300ms' }}>
                    <label className="flex flex-col flex-1 group">
                        <p className="text-slate-700 dark:text-slate-300 text-sm font-semibold leading-normal pb-2 uppercase tracking-wider transition-colors group-focus-within:text-primary">
                            City
                        </p>
                        <input
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="form-input flex w-full rounded-lg text-slate-900 dark:text-white border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 placeholder:text-slate-400 dark:placeholder:text-slate-600 px-4 text-base transition-all duration-300 outline-none hover:border-slate-400 dark:hover:border-slate-600"
                            placeholder="e.g. Mumbai"
                        />
                    </label>
                    <label className="flex flex-col flex-1 group">
                        <p className="text-slate-700 dark:text-slate-300 text-sm font-semibold leading-normal pb-2 uppercase tracking-wider transition-colors group-focus-within:text-primary">
                            State
                        </p>
                        <div className="relative">
                            <select
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="form-input flex w-full appearance-none rounded-lg text-slate-900 dark:text-white border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 px-4 text-base transition-all duration-300 outline-none hover:border-slate-400 dark:hover:border-slate-600 cursor-pointer"
                            >
                                <option value="" disabled>Select State</option>
                                <option value="MH">Maharashtra</option>
                                <option value="DL">Delhi</option>
                                <option value="KA">Karnataka</option>
                                <option value="TN">Tamil Nadu</option>
                                <option value="TS">Telangana</option>
                                <option value="KL">Kerala</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-4 text-slate-400 pointer-events-none transition-transform duration-300 group-focus-within:-rotate-180 group-focus-within:text-primary">
                                expand_more
                            </span>
                        </div>
                    </label>
                </div>

                {/* Pincode */}
                <div className="py-2 md:w-1/2 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both" style={{ animationDelay: '350ms' }}>
                    <label className="flex flex-col w-full group">
                        <p className="text-slate-700 dark:text-slate-300 text-sm font-semibold leading-normal pb-2 uppercase tracking-wider transition-colors group-focus-within:text-primary">
                            Pincode
                        </p>
                        <input
                            name="pincode"
                            type="text"
                            value={formData.pincode}
                            onChange={handleChange}
                            className="form-input flex w-full rounded-lg text-slate-900 dark:text-white border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 h-14 placeholder:text-slate-400 dark:placeholder:text-slate-600 px-4 text-base transition-all duration-300 outline-none hover:border-slate-400 dark:hover:border-slate-600"
                            maxLength={6}
                            placeholder="6-digit PIN"
                        />
                    </label>
                </div>
            </div>
            </div>

            {/* Mobile Sticky Footer CTA */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full duration-500 ease-out">
                <button
                    onClick={handleSubmit}
                    className="flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-xl h-14 bg-primary text-white text-base font-bold leading-normal transition-all duration-300 hover:bg-blue-600 hover:shadow-[0_8px_20px_-6px_rgba(19,127,236,0.5)] hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] group"
                >
                    <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">send</span>
                    <span className="truncate uppercase tracking-wide">
                        Submit Order Request
                    </span>
                </button>
                <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-500">
                    You will be redirected to WhatsApp to confirm order.
                </p>
            </div>

            {/* Success Overlay */}
            {showSuccess && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] max-w-sm w-full animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-out">
                        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                            <span className="material-symbols-outlined text-5xl">check_circle</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Request Sent!</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                            Your order request is complete. Please check the opened WhatsApp chat to review and send.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-primary font-medium text-sm bg-primary/10 px-5 py-3 rounded-full animate-pulse shadow-inner">
                            <span className="material-symbols-outlined animate-spin hidden">progress_activity</span>
                            <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                            Redirecting to home
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function OrderScreen() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-light dark:bg-background-dark" />}>
            <OrderForm />
        </Suspense>
    );
}