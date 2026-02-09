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
            const payload = {
                outlet_id: user.outletId,
                item_name: newItem.name,
                price: Number(newItem.price),
                category: newItem.category,
                image_url: newItem.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
                description: newItem.description,
                preparation_time: newItem.preparation_time,
                is_available: newItem.is_available
            };

            const savedItem = await fetcher<MenuItem>("/item", {
                method: "POST",
                body: JSON.stringify(payload)
            });
            setItems(prev => [...prev, savedItem]);
        } catch (err) {
            console.error("Failed to add item", err);
            alert("Failed to add item");
        } finally {
            setIsSubmitting(false);
        }
    };
