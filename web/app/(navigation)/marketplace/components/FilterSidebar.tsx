"use client";

import { Search, Filter, X } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface FilterSidebarProps {
    categories: string[];
    cuisines: string[]
    selectedCategory: string | null;
    setSelectedCategory: (cat: string | null) => void;
    selectedCuisine: string | null;
    setSelectedCuisine: (cuisine: string | null) => void;
    search: string;
    setSearch: (val: string) => void;
    selectedPrice: string | null;
    setSelectedPrice: (val: string | null) => void;
    className?: string;
}

export default function FilterSidebar({
    categories,
    cuisines,
    selectedCategory,
    setSelectedCategory,
    selectedCuisine,
    setSelectedCuisine,
    search,
    setSearch,
    selectedPrice,
    setSelectedPrice,
    className
}: FilterSidebarProps) {
    return (
        <aside className={`w-full md:w-64 space-y-6 ${className}`}>
            {/* Search */}
            <div>
                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Search</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search food..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Categories</h3>
                    {selectedCategory && (
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
                <div className="space-y-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${!selectedCategory
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "text-gray-600 hover:bg-gray-50 border border-transparent"
                            }`}
                    >
                        All Categories
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all border ${selectedCategory === cat
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "text-gray-600 hover:bg-gray-50 border-transparent"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cuisines */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Cuisine</h3>
                    {selectedCuisine && (
                        <button
                            onClick={() => setSelectedCuisine(null)}
                            className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
                <div className="space-y-2">
                    <button
                        onClick={() => setSelectedCuisine(null)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all border ${!selectedCuisine
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "text-gray-600 hover:bg-gray-50 border-transparent"
                            }`}
                    >
                        All Cuisines
                    </button>
                    {cuisines.map(cuisine => (
                        <button
                            key={cuisine}
                            onClick={() => setSelectedCuisine(cuisine)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all border ${selectedCuisine === cuisine
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "text-gray-600 hover:bg-gray-50 border-transparent"
                                }`}
                        >
                            {cuisine}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Price Range</h3>
                <div className="flex gap-2">
                    {["$", "$$", "$$$"].map((price) => (
                        <button
                            key={price}
                            onClick={() => setSelectedPrice(selectedPrice === price ? null : price)}
                            className={cn(
                                "flex-1 py-2 border rounded-lg text-sm font-medium transition-all",
                                selectedPrice === price
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
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
