"use client";

import { useAuth } from "@/app/context/AuthContext";
import { fetcher } from "@/app/lib/api";
import { useEffect, useState } from "react";
import ReservationsTable from "../components/ReservationsTable";

interface Reservation {
    id: number;
    customer_id: number;
    table_id: number;
    time_reserved_for: string;
    number_of_guests: number;
    status: string;
    created_at: string;
}

export default function DashboardReservationsPage() {
    const { user } = useAuth();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadReservations = async () => {
        if (!user || (user.role !== "owner" && user.role !== "outlet")) return;
        try {
            const res = await fetcher<Reservation[]>("/reservations");
            setReservations(res);
        } catch (err) {
            console.error("Failed to load reservations", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadReservations();
        const interval = setInterval(loadReservations, 10000);
        return () => clearInterval(interval);
    }, [user]);

    if (isLoading) return <div className="p-8">Loading reservations...</div>;

    return (
        <div className="space-y-8 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Reservations Management</h1>
            <ReservationsTable reservations={reservations} />
        </div>
    );
}
