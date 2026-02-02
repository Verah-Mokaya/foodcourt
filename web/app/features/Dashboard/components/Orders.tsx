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
                {pendingOrders.length === 0 && <p className="text-gray-400 text-sm">No pending orders.</p>}
                {pendingOrders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-xl border-l-4 border-orange-500 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-mono text-sm text-gray-500">#{order.id}</span>
                            <span className="font-bold">${order.total_amount.toFixed(2)}</span>
                        </div>
                        <div className="space-y-1 mb-4">
                            {(order.order_items || []).map((item, i) => (
                                <div key={i} className="text-sm flex justify-between">
                                    <span>{item.quantity}x Item #{item.menu_item_id}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => updateStatus(order.id, "preparing")}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                            >
                                Start Preparing
                            </button>
                        </div>
                    </div>
                ))}