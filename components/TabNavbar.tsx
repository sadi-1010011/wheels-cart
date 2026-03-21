import Link from "next/link";

export default function TabNavbar({ active }: { active?: string }) {

    const links = [
        {
            name: "Home",
            href: "/home",
            icon: "home"
        },
        {
            name: "Shop",
            href: "/shop",
            icon: "shop"
        },
        {
            name: "Wishlist",
            href: "/wishlist",
            icon: "favorite"
        },
        // {
        //     name: "Profile",
        //     href: "/profile",
        //     icon: "person"
        // }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-around border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-background-dark/90 backdrop-blur-xl px-4 pb-6 pt-3 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.2)]">
            {
                links.map((link) => {
                    const isActive = active === link.name.toLowerCase();
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`group relative flex flex-col items-center gap-1 transition-all duration-300 ease-out active:scale-90 ${
                                isActive ? "text-primary dark:text-primary scale-105" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                            }`}
                        >
                            {/* Animated Active Dot Indicator */}
                            {/* <div className={`absolute -top-3 w-1.5 h-1.5 rounded-full bg-primary transition-all duration-300 ease-out ${isActive ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-0 translate-y-2"}`} /> */}
                            
                            <span 
                                className={`material-symbols-outlined text-[26px] transition-transform duration-300 ease-in-out ${isActive ? "drop-shadow-md" : "group-hover:-translate-y-1"}`}
                                style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}
                            >
                                {link.icon}
                            </span>
                            <p className="text-[10px] font-bold leading-none tracking-wider uppercase">
                                {link.name}
                            </p>
                        </Link>
                    );
                })
            }
        </nav>
    )
}