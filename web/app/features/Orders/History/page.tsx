"use client";

import { useAuth } from "@/context/AuthContext.";
import { fetcher } from "@/lib/api";
import { Order } from "@/lib/types";
import { useEffect, useState } from "react";
import { Clock, CheckCircle2, ChefHat, XCircle } from "lucide-react";

export default function OrderHistoryPage() {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const loadOrders = async () => {
            try {

                const res = await fetcher<Order[]>(`/orders?customer_id=${user.id}&_sort=created_at&_order=desc`);
                setOrders(res);
            } catch (err) {
                console.error("Failed to load orders", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadOrders();

        // Poll for updates every 10s
        const interval = setInterval(loadOrders, 10000);
        return () => clearInterval(interval);
    }, [user]);

    if (isLoading) return <div className="p-8 text-center">Loading orders...</div>;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending": return <Clock className="h-5 w-5 text-orange-500" />;
            case "preparing": return <ChefHat className="h-5 w-5 text-blue-500" />;
            case "ready": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case "completed": return <CheckCircle2 className="h-5 w-5 text-gray-400" />;
            default: return <XCircle className="h-5 w-5 text-red-500" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "pending": return "Order Received";
            case "preparing": return "Kitchen is Preparing";
            case "ready": return "Ready for Pickup!";
            case "completed": return "Picked Up";
            default: return status;
        }
    };

    if (!user) return null;

    

