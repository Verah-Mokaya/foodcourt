"use client";

import { useAuth } from "@/app/context/AuthContext";
import { fetcher } from "@/app/lib/api";
import { Order, MenuItem } from "@/app/lib/types";
import { useEffect, useState } from "react";
import { Clock, CheckCircle2, ChefHat, XCircle, Calendar, Users, History, LayoutDashboard, ShoppingBag, Store } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/app/lib/routes";

interface Reservation {
    id: number;
    table_id: number;
    table_number?: number;
    time_reserved_for: string;
    number_of_guests: number;
    status: string;
    is_reassigned?: boolean;
    previous_table_number?: number;
    created_at: string;
}

export default function CustomerDashboardPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"active" | "history" | "reservations">("active");

    const loadData = async () => {
        if (!user) return;
        try {
            const [ordersRes, reservationsRes] = await Promise.all([
                fetcher<Order[]>(`/orders?customer_id=${user.id}&_sort=created_at&_order=desc`),
                fetcher<{ reservations: Reservation[] }>("/reservations/my")
            ]);
            setOrders(ordersRes);
            setReservations(reservationsRes.reservations);
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

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading your delicious details...</div>;

    const activeOrders = orders.filter(o => o.status !== "completed" && o.status !== "cancelled");
    const orderHistory = orders.filter(o => o.status === "completed" || o.status === "cancelled");

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

    const handleCancelReservation = async (id: number) => {
        if (!confirm("Are you sure you want to cancel this reservation?")) return;
        try {
            await fetcher(`/reservations/${id}/status`, {
                method: "PUT",
                body: JSON.stringify({ status: "canceled" })
            });
            setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "canceled" } : r));
        } catch (err) {
            console.error("Failed to cancel reservation", err);
            alert("Failed to cancel reservation");
        }
    };   