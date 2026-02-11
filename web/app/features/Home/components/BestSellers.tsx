"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/app/lib/routes";
import { fetcher } from "@/app/lib/api";

type BestSellerItem = {
    id: number;
    item_name: string;
    price: number;
    image_url: string;
    outlet_name: string;
    outlet_id: number;
};

export default function BestSellers() {
    const [items, setItems] = useState<BestSellerItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadBestSellers = async () => {
            try {
                const data = await fetcher<BestSellerItem[]>("/menu_items/best_sellers");
                setItems(data);
            } catch (err) {
                console.error("Failed to fetch best sellers", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadBestSellers();
    }, []);

 
    const marqueeItems = [...items, ...items, ...items, ...items];

    if (isLoading) return <div className="py-20 text-center">Loading best sellers...</div>;
    if (items.length === 0) return null;

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-6 mb-12">
                <span className="text-orange-600 font-bold uppercase tracking-wider text-sm">Customer Favorites</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">Best Selling Dishes</h2>
            </div>

            <div className="relative w-full group">
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

                {/* CSS Animation wrapper */}
                <div className="flex w-max overflow-hidden hover:pause-animation">
                    <div className="flex gap-8 animate-marquee group-hover:[animation-play-state:paused] px-4">
                        {marqueeItems.map((item, idx) => (
                            <Link
                                href={`${ROUTES.MARKETPLACE}?highlightId=${item.id}&outletId=${item.outlet_id || ''}`}
                                key={`${item.id}-${idx}`}
                                className="block min-w-[300px] w-[300px] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all shrink-0"
                            >
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={item.image_url}
                                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.item_name}</h3>
                                            <p className="text-sm text-gray-500">{item.outlet_name}</p>
                                        </div>
                                        <span className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                            ${typeof item.price === 'number' ? item.price.toFixed(2) : Number(item.price).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-orange-600">
                                        Order Now <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <style jsx>{`
                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                        animation: marquee 40s linear infinite;
                    }
                `}</style>
            </div>
        </section>
    );
}
