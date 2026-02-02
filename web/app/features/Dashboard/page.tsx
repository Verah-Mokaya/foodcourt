"use client";

import { useAuth } from "@/context/AuthContext";
import { fetcher, API_URL } from "@/lib/api";
import { Order } from "@/lib/types";
import { useEffect, useState } from "react";
import DashboardHome from "./components/DashboardHome";
import Orders from "./components/Orders";
export default function OwnerDashboardPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadOrders = async () => {
        if (!user || (user.role !== "owner" && user.role !== "outlet")) return;
        try {
            const outletId = user.role === 'outlet' ? user.id : (user.outletId || 1);
            const res = await fetcher<Order[]>(`/orders?outlet_id=${outletId}&_sort=created_at&_order=desc`);
            setOrders(res);
        } catch (err) {
            console.error("Failed to load orders", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
        const interval = setInterval(loadOrders, 10000);
        return () => clearInterval(interval);
    }, [user]);

    const updateStatus = async (orderId: number, newStatus: string) => {
        try {
            await fetch(`${API_URL}/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            // here is the Optimistic update
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } as Order : o));
        } catch (e) {
            console.error("Failed to update status", e);
            alert("Failed to update status");
        }
    };
    if (isLoading) return <div className="p-8">Loading dashboard...</div>;

    const stats = {
        pending: orders.filter(o => o.status === "pending").length,
        preparing: orders.filter(o => o.status === "preparing").length,
        ready: orders.filter(o => o.status === "ready").length
    };

    return (
        <div className="space-y-8 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <DashboardHome stats={stats} />
            <Orders orders={orders} updateStatus={updateStatus} />
        </div>
    );
}
