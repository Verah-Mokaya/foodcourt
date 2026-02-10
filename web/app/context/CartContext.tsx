"use client";

import { createContext, useContext } from "react";
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

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
import { useEffect } from "react";

    useEffect(() => {
        const stored = localStorage.getItem("fc_cart");
        if (stored) setItems(JSON.parse(stored));
    }, []);

    useEffect(() => {
        localStorage.setItem("fc_cart", JSON.stringify(items));
    }, [items]);

