"use client";

import { MenuItem } from "@/app/lib/types";
import { useCart } from "@/app/context/CartContext";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface MenuCardProps {
    item: MenuItem;
    outletName: string;
}

export default function MenuCard({ item, outletName }: MenuCardProps) {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening modal
        addToCart({
            menuItemId: item.id,
            name: item.item_name,
            price: item.price,
            outletId: item.outlet_id,
            outletName,
        });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md hover:border-blue-200 transition-all duration-300">
            <div className="relative h-48 w-full bg-gray-100">
                <img
                    src={item.image_url || "/placeholder-food.jpg"}
                    alt={item.item_name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{item.item_name}</h3>
                    <span className="text-sm font-bold text-blue-600 ml-2 whitespace-nowrap">${item.price}</span>
                </div>
                <div className="flex justify-between items-start mb-4">
                    <p className="text-xs text-gray-500 line-clamp-1">{outletName}</p>
                    {item.preparation_time && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium ml-2 whitespace-nowrap">
                            {item.preparation_time}m
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-600 mb-4 line-clamp-2 flex-grow">{item.category}</p>

                <div className="mt-auto">
                    <button
                        onClick={handleAdd}
                        className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${isAdded
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 hover:border-blue-300"
                            }`}
                    >
                        {isAdded ? (
                            <>
                                <Check className="h-4 w-4" />
                                Added!
                            </>
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
