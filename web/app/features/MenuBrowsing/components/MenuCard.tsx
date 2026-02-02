"use client";

import { MenuItem } from "@/app/lib/types";
import { useCart } from "@/app/context/CartContext";
import { Plus } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface MenuCardProps {
    item: MenuItem;
    outletName: string;
}

export default function MenuCard({ item, outletName }: MenuCardProps) {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = () => {
        addToCart({
            menuItemId: item.id,
            name: item.item_name,
            price: item.price,
            outletId: item.outlet_id,
            outletName,
        });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1000);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="relative h-40 w-full bg-gray-200">
                <img
                    src={item.image_url || "/placeholder-food.jpg"}
                    alt={item.item_name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{item.item_name}</h3>
                    <span className="text-sm font-semibold text-orange-600">${item.price}</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{outletName} • {item.category}</p>

                <div className="mt-auto">
                    <button
                        onClick={handleAdd}
                        className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${isAdded
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                            }`}
                    >
                        {isAdded ? (
                            <span>Added!</span>
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                Add to Cart
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}