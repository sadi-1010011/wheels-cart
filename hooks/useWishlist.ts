"use client";

import { useState, useEffect } from "react";

export function useWishlist() {
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("wheelzcart_wishlist");
        if (stored) {
            try {
                setWishlist(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse wishlist from localStorage", e);
            }
        }
        setIsLoaded(true);
    }, []);

    const toggleWishlist = (productId: string) => {
        setWishlist((prev) => {
            let updated;
            if (prev.includes(productId)) {
                updated = prev.filter((id) => id !== productId);
            } else {
                updated = [...prev, productId];
            }
            localStorage.setItem("wheelzcart_wishlist", JSON.stringify(updated));
            return updated;
        });
    };

    const isInWishlist = (productId: string) => wishlist.includes(productId);

    return { wishlist, toggleWishlist, isInWishlist, isLoaded };
}
