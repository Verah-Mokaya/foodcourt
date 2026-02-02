"use client";

import { useAuth } from "@/app/context/AuthContext";
import { fetcher, API_URL } from "@/app/lib/api";
import { MenuItem } from "@/app/lib/types";
import { useEffect, useState } from "react";
import MenuItemForm from "../components/MenuItemForm";
import MenuTable from "../components/MenuTable";

export default function MenuPage() {
    const { user } = useAuth();
    const [items, setItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!user) return;
        const loadItems = async () => {
            try {
                const outletId = user.outletId || 1;
                const res = await fetcher<MenuItem[]>(`/menu_items?outlet_id=${outletId}`);
                setItems(res);
            } catch (err) {
                console.error("Failed to load items", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadItems();
    }, [user]);

    const handleAdd = async (newItem: any) => {
        if (!user) return;
        setIsSubmitting(true);
        try {
            const payload = {
                outlet_id: user.outletId || 1,
                item_name: newItem.name,
                price: Number(newItem.price),
                category: newItem.category,
                image_url: newItem.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80", // Default
                is_available: newItem.is_available
            };

            const res = await fetch(`${API_URL}/menu_items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const savedItem = await res.json();
            setItems([...items, savedItem]);
        } catch (err) {
            alert("Failed to add item");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`${API_URL}/menu_items/${id}`, { method: "DELETE" });
            setItems(items.filter(i => i.id !== id));
        } catch (err) {
            alert("Failed to delete item");
        }
    };

    if (isLoading) return <div className="p-8">Loading menu...</div>;

    return (
        <div className="space-y-8 max-w-4xl p-6">
            <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
            <MenuItemForm onAdd={handleAdd} isSubmitting={isSubmitting} />
            <MenuTable items={items} onDelete={handleDelete} />
        </div>
    );
}

