"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { fetcher } from "@/app/lib/api";
import { MenuItem, Outlet } from "@/app/lib/types";
import MenuCard from "./components/MenuCard";
import FilterSidebar from "./components/FilterSidebar";
import MenuItemModal from "./components/MenuItemModal";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { Filter } from "lucide-react";
import { ROUTES } from "@/app/lib/routes";

export default function MarketplacePage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const searchParams = useSearchParams();
    const forcedOutletId = searchParams.get("outletId");

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
    const cuisines = Array.from(new Set(outlets.map(o => o.cuisine_type)));

    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

    const filteredItems = useMemo(() => {
        return menuItems.filter(item => {
            const matchesSearch = item.item_name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
            const matchesOutlet = forcedOutletId ? String(item.outlet_id) === forcedOutletId : true;

            const itemOutlet = outlets.find(o => o.id === item.outlet_id);
            const matchesCuisine = selectedCuisine ? itemOutlet?.cuisine_type === selectedCuisine : true;

            // Price Logic
            let matchesPrice = true;
            if (selectedPrice === "KSh") matchesPrice = typeof item.price === 'number' ? item.price < 300 : Number(item.price) < 300;
            else if (selectedPrice === "KSh x2") {
                const p = typeof item.price === 'number' ? item.price : Number(item.price);
                matchesPrice = p >= 300 && p <= 600;
            }
            else if (selectedPrice === "KSh x3") matchesPrice = typeof item.price === 'number' ? item.price > 600 : Number(item.price) > 600;

            return matchesSearch && matchesCategory && matchesPrice && matchesOutlet && matchesCuisine;
        });
    }, [menuItems, search, selectedCategory, selectedPrice, forcedOutletId, selectedCuisine, outlets]);

    const activeOutletName = useMemo(() => {
        if (!forcedOutletId) return null;
        return outlets.find(o => String(o.id) === forcedOutletId)?.outlet_name;
    }, [outlets, forcedOutletId]);

    const highlightId = searchParams.get("highlightId");

    useEffect(() => {
        if (highlightId && !isLoading && menuItems.length > 0) {
            const element = document.getElementById(`menu-item-${highlightId}`);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }

            // Auto-select item to show details (Add to Cart modal)
            const item = menuItems.find(i => String(i.id) === highlightId);
            if (item) {
                setSelectedItem(item);
            }
        }
    }, [highlightId, isLoading, menuItems]);

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
                            cuisines={cuisines}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            selectedCuisine={selectedCuisine}
                            setSelectedCuisine={setSelectedCuisine}
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
                            cuisines={cuisines}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={(cat) => { setSelectedCategory(cat); setIsSidebarOpen(false); }}
                            selectedCuisine={selectedCuisine}
                            setSelectedCuisine={setSelectedCuisine}
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
                        <h1 className="text-2xl font-bold text-gray-900">
                            {activeOutletName ? `Menu for ${activeOutletName}` : "What do you crave?"}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {activeOutletName ? `Showing curated items from ${activeOutletName}` : "Find your favorite food from our outlets."}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredItems.map(item => (
                            <div
                                key={item.id}
                                id={`menu-item-${item.id}`} // Add ID for scroll target
                                onClick={() => setSelectedItem(item)}
                                className={`
                                    cursor-pointer transition-all duration-500 hover:scale-[1.02] 
                                    ${String(item.id) === highlightId ? "ring-2 ring-orange-500 shadow-xl scale-[1.02]" : ""}
                                `}
                            >
                                <MenuCard
                                    item={item}
                                    outletName={getOutletName(Number(item.outlet_id))}
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
                <Link href={ROUTES.CART} className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-white text-gray-900 p-4 rounded-xl shadow-2xl border border-gray-100 flex justify-between items-center z-40 animate-in slide-in-from-bottom-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-lg text-sm font-bold">{itemCount}</span>
                        <span className="font-bold">View Order</span>
                    </div>
                    <span className="font-bold text-lg text-orange-600 font-mono">KSh {total.toFixed(2)}</span>
                </Link>
            )}

            {/* Detail Modal */}
            <MenuItemModal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                item={selectedItem}
                outletName={selectedItem ? getOutletName(Number(selectedItem.outlet_id)) : ""}
            />
        </div>
    );
}