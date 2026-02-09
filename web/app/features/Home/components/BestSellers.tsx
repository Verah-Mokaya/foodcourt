"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/app/lib/routes";

type BestSellerItem = {
    id: number;
    name: string;
    price: number;
    image: string;
    outletName: string;
};

// Hardcoded for now to ensure we have the specific "African" look requested, 
// though typically we'd fetch this. 
// Matching the IDs from db.json we just added/modified.
const featuredItems: BestSellerItem[] = [
    { id: 5, name: "Jollof Rice", price: 400, image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80", outletName: "Lagos Kitchen" },
    { id: 7, name: "Nyama Choma", price: 600, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80", outletName: "Nairobi Grills" },
    { id: 3, name: "Pondu", price: 300, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80", outletName: "Mama Africa" },
    { id: 6, name: "Suya Skewers", price: 250, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80", outletName: "Lagos Kitchen" },
    // Repeat for the marquee effect if needed, or we just utilize unique ones and duplicate list
];

// Duplicate list for infinite scroll smoothness
const marqueeItems = [...featuredItems, ...featuredItems, ...featuredItems];

export default function BestSellers() {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-6 mb-12">
                <span className="text-orange-600 font-bold uppercase tracking-wider text-sm">Customer Favorites</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">Best Selling African Dishes</h2>
            </div>

            <div className="relative w-full">
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

                <motion.div
                    className="flex gap-8 w-max"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        duration: 20,
                        ease: "linear"
                    }}
                >
                    {marqueeItems.map((item, idx) => (
                        <Link
                            href={`/marketplace`} // Redirect to marketplace generally as finding specific ID might require more logic
                            key={`${item.id}-${idx}`}
                            className="group min-w-[300px] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
                        >
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.name}</h3>
                                        <p className="text-sm text-gray-500">{item.outletName}</p>
                                    </div>
                                    <span className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded hidden">
                                        ${item.price}
                                    </span>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-orange-600 group-hover:gap-3 transition-all">
                                    Order Now <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
