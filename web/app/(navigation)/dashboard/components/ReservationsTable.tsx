"use client";

import { Calendar, Users, Clock, CheckCircle, XCircle, RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { fetcher } from "@/app/lib/api";
import { Table } from "@/app/lib/types";

interface Reservation {
    id: number;
    customer_id: number;
    table_id: number;
    table_number?: number;
    time_reserved_for: string;
    number_of_guests: number;
    status: string;
    created_at: string;
}

interface ReservationsTableProps {
    reservations: Reservation[];
}

export default function ReservationsTable({ reservations }: ReservationsTableProps) {
    const [tables, setTables] = useState<Table[]>([]);
    const [reassigningId, setReassigningId] = useState<number | null>(null);

    useEffect(() => {
        fetcher<Table[]>("/food_court_tables").then(setTables).catch(console.error);
    }, []);

    const handleReassign = async (resId: number, newTableId: number) => {
        try {
            await fetcher(`/reservations/${resId}/reassign`, {
                method: "PUT",
                body: JSON.stringify({ new_table_id: newTableId })
            });
            alert("Table reassigned successfully");
            setReassigningId(null);
            window.location.reload(); // Quick refresh to update state
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Failed to reassign table");
        }
    };