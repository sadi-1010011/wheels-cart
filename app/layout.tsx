import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope', // Matches the tailwind.config variable
})

export const metadata: Metadata = {
  title: "WheelzCart – Premium Alloy Wheels",
  description: "Premium alloy wheels for every car brand. Shop by size, PCD, and compatibility.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WheelzCart – Premium Alloy Wheels",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Synchronous theme script — runs before any content renders to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          } catch(_) {}
        `}} />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${manrope.variable} antialiased max-w-7xl mx-auto overflow-x-hidden relative shadow-2xl shadow-black/10`}
      >
        <ThemeProvider />
        {children}
      </body>
    </html>
  );
}
