"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "@/app/lib/types";

interface CartContextType {
    items: CartItem[];
    addToCart: (item: any) => void;
    removeFromCart: (menuItemId: number) => void;
    updateQuantity: (menuItemId: number, delta: number) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("fc_cart");
        if (stored) setItems(JSON.parse(stored));
    }, []);

    useEffect(() => {
        localStorage.setItem("fc_cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (newItem: any) => {
        setItems(prev => {
            const existing = prev.find(i => i.menuItemId === newItem.menuItemId);
            if (existing) {
                return prev.map(i => i.menuItemId === newItem.menuItemId ? { ...i, quantity: i.quantity + (newItem.quantity || 1) } : i);
            }
            return [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
        });
    };

    const removeFromCart = (id: number) => {
        setItems(prev => prev.filter(i => i.menuItemId !== id));
    };

    const updateQuantity = (id: number, delta: number) => {
        setItems(prev => prev.map(i => {
            if (i.menuItemId === id) {
                const newQty = Math.max(1, i.quantity + delta);
                return { ...i, quantity: newQty };
            }
            return i;
        }));
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
}