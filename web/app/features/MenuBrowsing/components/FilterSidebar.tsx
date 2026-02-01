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
        </aside>
    );
}