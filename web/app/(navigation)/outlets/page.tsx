"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/app/lib/api";
import { Outlet } from "@/app/lib/types";
import { ROUTES } from "@/app/lib/routes";
import Link from "next/link";
import { Store, ArrowRight, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function OutletsPage() {
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadOutlets = async () => {
            try {
                const data = await fetcher<Outlet[]>("/outlets");
                setOutlets(data);
            } catch (err) {
                console.error("Failed to load outlets", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadOutlets();
    }, []);

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading fine restaurants...</div>;

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-6">
                <div className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Our Partner Outlets</h1>
                    <p className="text-gray-500">Discover the best culinary experiences in the food court.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {outlets.map((outlet, idx) => (
                        <motion.div
                            key={outlet.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <Link href={`${ROUTES.MARKETPLACE}?outletId=${outlet.id}`}>
                                <div className="relative h-48 bg-gray-200 overflow-hidden">
                                    <img
                                        src={outlet.image_url || "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000"}
                                        alt={outlet.outlet_name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-orange-600 flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-current" />
                                        4.5
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-xl font-bold text-gray-900">{outlet.outlet_name}</h2>
                                        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full uppercase">
                                            {outlet.cuisine_type}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                        {outlet.description || "Experience authentic flavors prepared with the freshest ingredients by our expert chefs."}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            20-30 min
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Store className="w-4 h-4" />
                                            Active Now
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-orange-600 group-hover:gap-3 transition-all">
                                        View Menu <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {outlets.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <Store className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No outlets found</h3>
                        <p className="text-gray-500">We're always adding new partners. Check back soon!</p>
                    </div>
                )}
            </div>
        </main>
    );
}