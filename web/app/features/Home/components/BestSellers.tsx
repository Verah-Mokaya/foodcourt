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


const featuredItems: BestSellerItem[] = [
    { id: 5, name: "Jollof Rice", price: 400, image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80", outletName: "Lagos Kitchen" },
    { id: 7, name: "Nyama Choma", price: 600, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80", outletName: "Nairobi Grills" },
    { id: 3, name: "Pondu", price: 300, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80", outletName: "Mama Africa" },
    { id: 6, name: "Suya Skewers", price: 250, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80", outletName: "Lagos Kitchen" },
    
];

// Duplicate list for infinite scroll smoothness
const marqueeItems = [...featuredItems, ...featuredItems, ...featuredItems];

export default function BestSellers() {
    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-6 mb-16">
                <span className="text-blue-600 font-semibold uppercase tracking-widest text-xs">Customer Favorites</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-3 text-gray-900">Best Selling African Dishes</h2>
                <p className="text-gray-600 mt-4 max-w-2xl leading-relaxed">Discover our most popular dishes loved by thousands of customers</p>
            </div>

            <div className="relative w-full">
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-10" />

                <motion.div
                    className="flex gap-6 w-max"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        duration: 25,
                        ease: "linear"
                    }}
                >
                    {marqueeItems.map((item, idx) => (
                        <Link
                            href={ROUTES.MARKETPLACE}
                            key={`${item.id}-${idx}`}
                            className="group min-w-[320px] bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                        >
                            <div className="h-56 overflow-hidden bg-gray-100">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{item.outletName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                    <span className="font-bold text-lg text-gray-900">
                                        ${item.price}
                                    </span>
                                    <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                                        Order <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
