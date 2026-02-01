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
            {/* Placeholder for filters */}
        </aside>
    );
}