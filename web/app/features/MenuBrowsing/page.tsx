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

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-4 py-4 md:hidden">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        {/* Mobile Search - syncing with main search state */}
                        <input
                            type="text"
                            placeholder="Search food..."
                            className="w-full pl-4 pr-4 py-2 bg-gray-100 rounded-lg text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 bg-gray-100 rounded-lg text-gray-600"
                    >
                        <Filter className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                {/* Sidebar (Desktop) */}
                <div className="hidden md:block w-64 shrink-0">
                    <div className="sticky top-24">
                        <FilterSidebar
                            categories={categories}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            search={search}
                            setSearch={setSearch}
                            selectedPrice={selectedPrice}
                            setSelectedPrice={setSelectedPrice}
                        />
                    </div>
                </div>

                {/* Mobile Filter Drawer (Simplified) */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-50 bg-white p-4 md:hidden animate-in slide-in-from-right">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Filters</h2>
                            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500">Done</button>
                        </div>
                        <FilterSidebar
                            categories={categories}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={(cat) => { setSelectedCategory(cat); setIsSidebarOpen(false); }}
                            search={search}
                            setSearch={setSearch}
                            selectedPrice={selectedPrice}
                            setSelectedPrice={setSelectedPrice}
                        />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">What do you crave?</h1>
                        <p className="text-gray-500 text-sm">Find your favorite food from our outlets.</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredItems.map(item => (
                            <div key={item.id} onClick={() => setSelectedItem(item)} className="cursor-pointer transition-transform hover:scale-[1.02]">
                                <MenuCard
                                    item={item}
                                    outletName={getOutletName(item.outlet_id)}
                                />
                            </div>
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500">No items found matching your criteria.</p>
                            <button
                                onClick={() => { setSearch(""); setSelectedCategory(null); setSelectedPrice(null); }}
                                className="mt-4 text-orange-600 font-bold hover:underline"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Floating Cart Button (Mobile) */}
            {itemCount > 0 && (
                <Link href="/features/Cart" className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-gray-900 text-white p-4 rounded-xl shadow-xl flex justify-between items-center z-40 animate-in slide-in-from-bottom-5 hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                        <span className="bg-white/20 px-3 py-1 rounded-lg text-sm font-bold">{itemCount}</span>
                        <span className="font-bold">View Order</span>
                    </div>
                    <span className="font-bold text-lg">${total.toFixed(2)}</span>
                </Link>
            )}

            {/* Detail Modal */}
            <MenuItemModal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                item={selectedItem}
                outletName={selectedItem ? getOutletName(selectedItem.outlet_id) : ""}
            />
        </div>        
    );
}