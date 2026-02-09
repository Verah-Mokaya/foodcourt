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

