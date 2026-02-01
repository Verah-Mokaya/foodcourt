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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-gray-500 text-sm font-medium">Pending Orders</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-gray-500 text-sm font-medium">Preparing</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.preparing}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"></div>