"use client";

import { useAuth } from "@/app/context/AuthContext";
import { fetcher, API_URL } from "@/app/lib/api";
import { useEffect, useState } from "react";
import { Calendar, Users, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/app/lib/routes";

interface Reservation {
    id: number;
    table_id: number;
    time_reserved_for: string;
    number_of_guests: number;
    status: string;
    created_at: string;
}

export default function ReservationsPage() {
    const { user } = useAuth();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);