"use client";

import { Check, ChefHat, Clock } from "lucide-react";

interface DashboardHomeProps {
    stats: {
        pending: number;
        preparing: number;
        ready: number;
    }
}