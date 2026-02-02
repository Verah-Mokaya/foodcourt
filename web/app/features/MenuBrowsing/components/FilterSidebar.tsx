"use client";

import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
    categories: string[];
    selectedCategory: string | null;
    setSelectedCategory: (cat: string | null) => void;
    search: string;
    setSearch: (val: string) => void;
    selectedPrice: string | null;
    setSelectedPrice: (val: string | null) => void;
    className?: string;
}

export default function FilterSidebar({
    categories,
    selectedCategory,
    setSelectedCategory,
    search,
    setSearch,
    selectedPrice,
    setSelectedPrice,
    className
}: FilterSidebarProps) {
    return (
        <aside className={`w-full md:w-64 space-y-8 ${className}`}>
            {/* Search */}
            <div>
                <h3 className="font-bold text-gray-900 mb-3">Search</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search food..."
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-900">Categories</h3>
                    {selectedCategory && (
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="text-xs text-orange-600 font-medium hover:underline"
                        >
                            Clear
                        </button>
                    )}
                </div>
                <div className="space-y-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!selectedCategory
                            ? "bg-orange-50 text-orange-700"
                            : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        All Categories
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat
                                ? "bg-orange-50 text-orange-700"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range (Visual Only for now) */}
            <div>
                <h3 className="font-bold text-gray-900 mb-3">Price Range</h3>
                <div className="flex gap-2">
                    {["$", "$$", "$$$"].map((price) => (
                        <button
                            key={price}
                            onClick={() => setSelectedPrice(selectedPrice === price ? null : price)}
                            className={cn(
                                "flex-1 py-1 border rounded-lg text-sm font-medium transition-colors",
                                selectedPrice === price
                                    ? "bg-orange-600 text-white border-orange-600"
                                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            )}
                        >
                            {price}
                        </button>
                    ))}
                </div>
            </div>           
        </aside>
    );
}