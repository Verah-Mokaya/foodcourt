"use client";

import { Order } from "@/lib/types";
import { Check, ChefHat, Clock } from "lucide-react";

interface OrdersProps {
    orders: Order[];
    updateStatus: (id: number, status: string) => void;
}

export default function Orders({ orders, updateStatus }: OrdersProps) {
    const pendingOrders = orders.filter(o => o.status === "pending");
    const preparingOrders = orders.filter(o => o.status === "preparing");
    const readyOrders = orders.filter(o => o.status === "ready");

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Incoming Orders */}
            <section className="space-y-4">
                <h2 className="font-bold text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    Incoming
                </h2>