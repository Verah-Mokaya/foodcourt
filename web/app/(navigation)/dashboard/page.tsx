"use client";

import { useAuth } from "@/app/context/AuthContext";
import { fetcher, API_URL } from "@/app/lib/api";
import { Order } from "@/app/lib/types";
import { useEffect, useState } from "react";
import DashboardHome from "./components/DashboardHome";
import Orders from "./components/Orders";
import ReservationsTable from "./components/ReservationsTable";

interface Reservation {
    id: number;
    customer_id: number;
    table_id: number;
    time_reserved_for: string;
    number_of_guests: number;
    status: string;
    created_at: string;
}
export default function OwnerDashboardPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        if (!user || (user.role !== "owner" && user.role !== "outlet")) return;
        try {
            const outletId = user.role === 'outlet' ? user.id : (user.outletId || 1);
            const [ordersRes, reservationsRes] = await Promise.all([
                fetcher<Order[]>(`/orders?outlet_id=${outletId}&_sort=created_at&_order=desc`),
                fetcher<Reservation[]>("/reservations")
            ]);
            setOrders(ordersRes);
            setReservations(reservationsRes);
        } catch (err) {
            console.error("Failed to load dashboard data", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 10000);
        return () => clearInterval(interval);
    }, [user]);

    const updateStatus = async (orderId: number, newStatus: string) => {
        try {
            await fetcher(`/orders/${orderId}`, {
                method: "PATCH",
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
            <div className="grid grid-cols-1 gap-8">
                <Orders orders={orders} updateStatus={updateStatus} />
                <ReservationsTable reservations={reservations} />
            </div>
        </div>
    );
}
