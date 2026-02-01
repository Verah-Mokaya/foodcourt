"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { MenuItem, Outlet } from "@/lib/types";
import MenuCard from "./components/MenuCard";
import FilterSidebar from "./components/FilterSidebar";
import MenuItemModal from "./components/MenuItemModal";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Filter } from "lucide-react";

export default function MarketplacePage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    
    const { itemCount, total } = useCart();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [itemsRes, outletsRes] = await Promise.all([
                    fetcher<MenuItem[]>("/menu_items"),
                    fetcher<Outlet[]>("/outlets")
                ]);
                setMenuItems(itemsRes);
                setOutlets(outletsRes);
            } catch (err) {
                console.error("Failed to load marketplace data", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const getOutletName = (id: number) => outlets.find(o => o.id === id)?.outlet_name || "Unknown";

    const categories = Array.from(new Set(menuItems.map(i => i.category)));

    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

    const filteredItems = menuItems.filter(item => {
        const matchesSearch = item.item_name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory ? item.category === selectedCategory : true;

        // Price Logic
        let matchesPrice = true;
        if (selectedPrice === "$") matchesPrice = item.price < 300; // Affordable
        else if (selectedPrice === "$$") matchesPrice = item.price >= 300 && item.price <= 600; // Mid
        else if (selectedPrice === "$$$") matchesPrice = item.price > 600; // Premium

        return matchesSearch && matchesCategory && matchesPrice;
    });

    if (isLoading) return <div className="p-8 text-center">Loading menu...</div>;

    return <div>{/* Placeholder */}</div>;
}