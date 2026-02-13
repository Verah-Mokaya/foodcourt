"use client";

import { Order, OrderItem } from "@/app/lib/types";
import { Check, ChefHat, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface OrdersProps {
    orders: Order[];
    updateStatus: (id: number, status: string) => void;
}

const statusColors = {
    pending: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badge: "bg-blue-100 text-blue-700", icon: "text-blue-600" },
    preparing: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700", icon: "text-amber-600" },
    ready: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", badge: "bg-green-100 text-green-700", icon: "text-green-600" }
};

export default function Orders({ orders, updateStatus }: OrdersProps) {
    const pendingOrders = orders.filter(o => o.status === "pending");
    const preparingOrders = orders.filter(o => o.status === "preparing");
    const readyOrders = orders.filter(o => o.status === "ready");

    const OrderCard = ({ order, status }: { order: Order; status: 'pending' | 'preparing' | 'ready' }) => {
        const colors = statusColors[status];
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={order.id}
                className={`${colors.bg} border-2 ${colors.border} p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300`}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-gray-600">Order #{order.id}</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded ${colors.badge}`}>
                            {status.toUpperCase()}
                        </span>
                    </div>
                    <span className="font-bold text-lg text-gray-900">${order.total_amount.toFixed(2)}</span>
                </div>
                
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                    {(order.order_items || []).map((item, i) => (
                        <div key={i} className="text-sm flex justify-between text-gray-700">
                            <span className="font-medium">{item.quantity}x {item.item_name || `Item #${item.menu_item_id}`}</span>
                            <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    {status === "pending" && (
                        <button
                            onClick={() => updateStatus(Number(order.id), "preparing")}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors active:scale-95"
                        >
                            Start Preparing
                        </button>
                    )}
                    {status === "preparing" && (
                        <button
                            onClick={() => updateStatus(Number(order.id), "ready")}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors active:scale-95"
                        >
                            Mark Ready
                        </button>
                    )}
                    {status === "ready" && (
                        <button
                            onClick={() => updateStatus(Number(order.id), "completed")}
                            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors active:scale-95"
                        >
                            Complete
                        </button>
                    )}
                </div>
            </motion.div>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Incoming Orders */}
            <section className="space-y-4">
                <h2 className="font-bold text-xl flex items-center gap-3 text-gray-900 mb-6">
                    <div className="bg-blue-100 p-2 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    Incoming Orders
                </h2>
                {pendingOrders.length === 0 ? (
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">No pending orders</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pendingOrders.map(order => (
                            <OrderCard key={order.id} order={order} status="pending" />
                        ))}
                    </div>
                )}
            </section>

            {/* Cooking & Ready */}
            <section className="space-y-4">
                <h2 className="font-bold text-xl flex items-center gap-3 text-gray-900 mb-6">
                    <div className="bg-amber-100 p-2 rounded-lg">
                        <ChefHat className="w-5 h-5 text-amber-600" />
                    </div>
                    In Progress & Ready
                </h2>
                {[...preparingOrders, ...readyOrders].length === 0 ? (
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 text-center">
                        <Check className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">All caught up!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {preparingOrders.map(order => (
                            <OrderCard key={order.id} order={order} status="preparing" />
                        ))}
                        {readyOrders.map(order => (
                            <OrderCard key={order.id} order={order} status="ready" />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
