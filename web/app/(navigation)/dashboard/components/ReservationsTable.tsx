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