"use client";

import Link from "next/link";
import { useState } from "react";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    
    const phoneNumber = "916238998062";
    const text = `*New Contact Request*\n\n*Name:* ${name}\n*Email:* ${email}\n*Message:* ${message}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased font-display overflow-x-hidden pb-24">
      <header className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-4 fade-in duration-500">
        <Link href="/home" className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </Link>
        <h1 className="text-slate-900 dark:text-slate-100 text-xl font-extrabold leading-tight tracking-tight flex-1 text-center">
          Contact <span className="text-primary">Us</span>
        </h1>
        <div className="flex w-10 items-center justify-end" />
      </header>

      <main className="flex flex-col gap-6 px-4 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both" style={{ animationDelay: '100ms' }}>
        <div className="bg-white dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Get in Touch</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">We'd love to hear from you. Please fill out the form below or contact us directly.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary">mail</span>
              </div>
              <div className="text-sm">
                <p className="font-bold">Email</p>
                <a href="mailto:support@wheelzcart.com" className="text-slate-500 dark:text-slate-400">support@wheelzcart.com</a>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary">call</span>
              </div>
              <div className="text-sm">
                <p className="font-bold">Phone</p>
                <a href="tel:+911234567890" className="text-slate-500 dark:text-slate-400">+91 123 456 7890</a>
              </div>
            </div>
          </div>

          <form onSubmit={handleWhatsAppSubmit} className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="space-y-1.5 focus-within:-translate-y-0.5 transition-transform duration-300">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full appearance-none bg-slate-100 dark:bg-slate-800 border-none rounded-lg h-12 px-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 transition-all duration-300 outline-none" 
              />
            </div>
            
            <div className="space-y-1.5 focus-within:-translate-y-0.5 transition-transform duration-300">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">Email</label>
              <input 
                type="email" 
                placeholder="john@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full appearance-none bg-slate-100 dark:bg-slate-800 border-none rounded-lg h-12 px-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 transition-all duration-300 outline-none" 
              />
            </div>
            
            <div className="space-y-1.5 focus-within:-translate-y-0.5 transition-transform duration-300">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">Message</label>
              <textarea 
                placeholder="How can we help you?" 
                rows={4} 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full appearance-none bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 transition-all duration-300 outline-none resize-none" 
              />
            </div>
            
            <button type="submit" className="w-full flex items-center justify-center rounded-lg h-12 bg-primary text-white text-base font-bold transition-all duration-300 hover:bg-blue-500 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]">
              Send Message
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
