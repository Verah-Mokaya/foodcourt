"use client";

import { useAuth } from "@/app/context/AuthContext";
import { fetcher, API_URL } from "@/app/lib/api";
import { Order } from "@/app/lib/types";
import { useEffect, useState } from "react";
import DashboardHome from "./components/DashboardHome";
import Orders from "./components/Orders";
import { LayoutDashboard } from "lucide-react";

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
            // Optimistic update
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } as Order : o));
        } catch (e) {
            console.error("Failed to update status", e);
            alert("Failed to update status");
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading dashboard...</p>
            </div>
        </div>
    );

    const stats = {
        pending: orders.filter(o => o.status === "pending").length,
        preparing: orders.filter(o => o.status === "preparing").length,
        ready: orders.filter(o => o.status === "ready").length
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-600 p-3 rounded-lg">
                            <LayoutDashboard className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Order Dashboard</h1>
                    </div>
                    <p className="text-gray-600 text-lg">Manage and track all orders in real-time</p>
                </div>

                {/* Stats Cards */}
                <div className="mb-10">
                    <DashboardHome stats={stats} />
                </div>

                {/* Orders Section */}
                <div>
                    <Orders orders={orders} updateStatus={updateStatus} />
                </div>
            </div>
        </div>
    );
}
