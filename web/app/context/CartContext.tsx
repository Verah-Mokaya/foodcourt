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
