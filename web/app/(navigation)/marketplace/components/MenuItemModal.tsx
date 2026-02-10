"use client";

import { MenuItem } from "@/app/lib/types";
import { useCart } from "@/app/context/CartContext";
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

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative flex flex-col md:flex-row">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white z-10"
                >
                    <X className="h-5 w-5 text-gray-600" />
                </button>

                {/* Hero Image */}
                <div className="h-64 md:h-auto md:w-1/2 bg-gray-200">
                    <img
                        src={item.image_url}
                        alt={item.item_name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 md:w-1/2 flex flex-col h-full">
                    <div className="mb-auto">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full uppercase tracking-wider">
                                {item.category}
                            </span>
                            {item.is_available && (
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wider">
                                    Available
                                </span>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.item_name}</h2>
                        <p className="text-sm font-medium text-gray-500 mb-4">{outletName}</p>

                        <p className="text-gray-600 leading-relaxed mb-6">
                            {item.description || "Freshly prepared with authentic ingredients. A customer favorite that brings the taste of tradition to your table."}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Price</span>
                            <span className="text-2xl font-bold text-gray-900">${(item.price * quantity).toFixed(2)}</span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-2">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-2 hover:bg-white rounded-lg transition-colors"
                                >
                                    <Minus className="h-4 w-4 text-gray-600" />
                                </button>
                                <span className="font-bold w-4 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-2 hover:bg-white rounded-lg transition-colors"
                                >
                                    <Plus className="h-4 w-4 text-gray-600" />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding || !item.is_available}
                                className="flex-1 py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isAdding ? (
                                    "Adding..."
                                ) : (
                                    <>
                                        <ShoppingCart className="h-5 w-5" />
                                        Add to Cart
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}