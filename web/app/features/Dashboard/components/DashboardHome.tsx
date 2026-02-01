"use client";

import { Check, ChefHat, Clock } from "lucide-react";

interface DashboardHomeProps {
    stats: {
        pending: number;
        preparing: number;
        ready: number;
    }
}

export default function DashboardHome({ stats }: DashboardHomeProps) {
    return (