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