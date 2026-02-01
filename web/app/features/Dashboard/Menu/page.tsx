"use client";

import { useAuth } from "@/context/AuthContext";
import { fetcher, API_URL } from "@/lib/api";
import { MenuItem } from "@/lib/types";
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
