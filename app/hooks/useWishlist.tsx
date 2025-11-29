import { useState, useEffect } from 'react';

export interface WishlistItem {
  id: string;
  variantId: string;
  title: string;
  handle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  image?: {
    url: string;
    altText?: string;
  };
  availableForSale: boolean;
}

const WISHLIST_STORAGE_KEY = 'cricket-sphere-wishlist';

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as WishlistItem[];
          setWishlistItems(parsed);
        } catch (error) {
          console.error('Failed to parse wishlist:', error);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isLoaded]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems((prev) => {
      // Check if item already exists
      const exists = prev.some((i) => i.variantId === item.variantId);
      if (exists) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeFromWishlist = (variantId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const isInWishlist = (variantId: string) => {
    return wishlistItems.some((item) => item.variantId === variantId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlistItems.length,
  };
}
