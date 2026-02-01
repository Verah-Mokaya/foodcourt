"use client";

import { MenuItem } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface MenuItemModalProps {
    item: MenuItem | null;
    isOpen: boolean;
    onClose: () => void;
    outletName: string;
}

export default function MenuItemModal({ item, isOpen, onClose, outletName }: MenuItemModalProps) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    if (!isOpen || !item) return null;

    const handleAddToCart = () => {
        setIsAdding(true);
        setTimeout(() => {
            addToCart({
                menuItemId: item.id,
                name: item.item_name,
                price: item.price,
                outletId: item.outlet_id,
                outletName,
                quantity
            });
            setIsAdding(false);
            setQuantity(1);
            onClose();
        }, 500);
    };
