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
        if (!user || !user.outletId) return;
        const loadItems = async () => {
            try {
                // Use the correct outlet-specific endpoint
                const res = await fetcher<{ items: MenuItem[] }>(`/outlets/${user.outletId}`);
                setItems(res.items);
            } catch (err) {
                console.error("Failed to load items", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadItems();
    }, [user]);

    const handleAdd = async (newItem: any) => {
        if (!user || !user.outletId) return;
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("item_name", newItem.name);
            formData.append("price", String(newItem.price));
            formData.append("category", newItem.category);
            formData.append("description", newItem.description || "");
            formData.append("preparation_time", String(newItem.preparation_time));
            // Default is_available to true if undefined, convert to string for FormData
            formData.append("is_available", String(newItem.is_available ?? true));

            if (newItem.image instanceof File) {
                formData.append("image", newItem.image);
            } else {
                // Fallback image if no file provided
                formData.append("image_url", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80");
            }

            const savedItem = await fetcher<MenuItem>("/item", {
                method: "POST",
                body: formData
            });
            setItems(prev => [...prev, savedItem]);
        } catch (err) {
            console.error("Failed to add item", err);
            alert("Failed to add item");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetcher(`/item/${id}`, {
                method: "DELETE"
            });
            setItems(items.filter(i => i.id !== id));
        } catch (err) {
            console.error("Failed to delete item", err);
            alert("Failed to delete item");
        }
    };

    if (isLoading) return <div className="p-8">Loading menu...</div>;

    return (
        <div className="space-y-8 max-w-7xl p-6 mx-auto">
            <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
            <MenuItemForm onAdd={handleAdd} isSubmitting={isSubmitting} />
            <MenuTable items={items} onDelete={handleDelete} />
        </div>
    );
}

