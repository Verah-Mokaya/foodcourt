"use client";

import { useAuth } from "@/app/context/AuthContext";
import { fetcher } from "@/app/lib/api";
import { Order } from "@/app/lib/types";
import { useEffect, useState } from "react";
import { Clock, CheckCircle2, ChefHat, XCircle } from "lucide-react";

export default function OrderHistoryPage() {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const loadOrders = async () => {
            try {
                const res = await fetcher<Order[]>(`/orders?customer_id=${user.id}&_sort=created_at&_order=desc`);
                setOrders(res);
            } catch (err) {
                console.error("Failed to load orders", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadOrders();

        // Poll for updates every 10s
        const interval = setInterval(loadOrders, 10000);
        return () => clearInterval(interval);
    }, [user]);

    if (isLoading) return <div className="p-8 text-center">Loading orders...</div>;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending": return <Clock className="h-5 w-5 text-orange-500" />;
            case "preparing": return <ChefHat className="h-5 w-5 text-blue-500" />;
            case "ready": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case "completed": return <CheckCircle2 className="h-5 w-5 text-gray-400" />;
            default: return <XCircle className="h-5 w-5 text-red-500" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "pending": return "Order Received";
            case "preparing": return "Kitchen is Preparing";
            case "ready": return "Ready for Pickup!";
            case "completed": return "Picked Up";
            default: return status;
        }
    };

    if (!user) return null;

    return (
        <div className="space-y-6 pb-20">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hi, {user.first_name || user.name}</h1>
                    <p className="text-gray-500 text-sm dark:text-gray-400">Track your yummy orders here.</p>
                </div>
            </header>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Active Orders</h2>

                {orders.length === 0 && (
                    <p className="text-gray-500 text-sm">No recent orders.</p>
                )}

                {orders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                {getStatusIcon(order.status)}
                                <div>
                                    <p className="font-semibold text-gray-900">{getStatusText(order.status)}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                            <span className="font-bold text-gray-900">${order.total_amount.toFixed(2)}</span>
                        </div>

                        <div className="border-t border-gray-100 pt-3 text-sm text-gray-600 space-y-1">
                            {(order.order_items || []).map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span>{item.quantity}x Item #{item.menu_item_id}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}