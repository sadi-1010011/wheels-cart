"use client";

import TabNavbar from "@/components/TabNavbar";
import { TopNavbar } from "@/components/TopNavbar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    if (pathname.includes("home")) setActiveTab("home");
    else if (pathname.includes("shop")) setActiveTab("shop");
    else if (pathname.includes("wishlist")) setActiveTab("wishlist");
    else if (pathname.includes("profile")) setActiveTab("profile");
    else setActiveTab("");
  }, [pathname]);

  const isHome = pathname.includes("/home");
  const isProduct = pathname.includes("/product");

  let title;
  if (!isHome) {
    if (pathname.includes("shop")) title = "Alloy Wheels";
    else if (pathname.includes("wishlist")) title = "Your Wishlist";
    else if (pathname.includes("order")) title = "Order Request Form";
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased font-display overflow-x-hidden">
      {!isProduct && <TopNavbar title={title} showSidebarToggle={isHome} />}
      <div className="flex flex-col flex-1">
        {children}
      </div>
      {activeTab && !isProduct && <TabNavbar active={activeTab} />}
    </div>
  );
}
