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
