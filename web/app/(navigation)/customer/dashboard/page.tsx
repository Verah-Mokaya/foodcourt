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

export default function CustomerDashboardPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"active" | "history" | "reservations">("active");

    const loadData = async () => {
        if (!user) return;
        try {
            const [ordersRes, reservationsRes] = await Promise.all([
                fetcher<Order[]>(`/orders?customer_id=${user.id}&_sort=created_at&_order=desc`),
                fetcher<{ reservations: Reservation[] }>("/reservations/my")
            ]);
            setOrders(ordersRes);
            setReservations(reservationsRes.reservations);
        } catch (err) {
            console.error("Failed to load dashboard data", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 10000);
        return () => clearInterval(interval);
    }, [user]);

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading your delicious details...</div>;

    const activeOrders = orders.filter(o => o.status !== "completed" && o.status !== "cancelled");
    const orderHistory = orders.filter(o => o.status === "completed" || o.status === "cancelled");

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

    const handleCancelReservation = async (id: number) => {
        if (!confirm("Are you sure you want to cancel this reservation?")) return;
        try {
            await fetcher(`/reservations/${id}/status`, {
                method: "PUT",
                body: JSON.stringify({ status: "canceled" })
            });
            setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "canceled" } : r));
        } catch (err) {
            console.error("Failed to cancel reservation", err);
            alert("Failed to cancel reservation");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 -mt-20 pt-20">
            <div className="max-w-6xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.first_name || user?.name}!</h1>
                        <p className="text-gray-500 text-sm">Manage your orders and reservations in one place.</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Link href={ROUTES.MARKETPLACE} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-700 transition-all">
                            <ShoppingBag className="w-5 h-5" />
                            Order Now
                        </Link>
                    </div>
                </header>

                {/* Tabs Container */}
                <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 sticky top-24 z-10">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab("active")}
                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === "active"
                                ? "bg-orange-600 text-white shadow-md shadow-orange-200"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                }`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Active Orders ({activeOrders.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === "history"
                                ? "bg-orange-600 text-white shadow-md shadow-orange-200"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                }`}
                        >
                            <History className="w-4 h-4" />
                            Order History
                        </button>
                        <button
                            onClick={() => setActiveTab("reservations")}
                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === "reservations"
                                ? "bg-orange-600 text-white shadow-md shadow-orange-200"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                }`}
                        >
                            <Calendar className="w-4 h-4" />
                            Reservations ({reservations.length})
                        </button>
                    </div>
                </div>

                {/* Content Buffer */}
                <div className="min-h-[400px]">
                    {activeTab === "active" && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            {activeOrders.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No active orders right now.</p>
                                    <Link href={ROUTES.MARKETPLACE} className="text-orange-600 font-bold mt-2 inline-block">Craving something?</Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeOrders.map(order => (
                                        <div key={order.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-orange-50 p-2 rounded-xl">
                                                        {getStatusIcon(order.status)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-gray-900">{getStatusText(order.status)}</p>
                                                            {order.discount_amount && order.discount_amount > 0 && (
                                                                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">-${order.discount_amount.toFixed(2)}</span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500">Ordered {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    </div>
                                                </div>
                                                <span className="font-bold text-gray-900">${order.total_amount.toFixed(2)}</span>
                                            </div>

                                            {order.status === 'ready' && (
                                                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm font-bold flex items-center gap-2 animate-pulse">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Your order is ready for pickup!
                                                </div>
                                            )}

                                            {order.time_till_ready && (order.status === 'pending' || order.status === 'preparing') && (
                                                <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium flex items-center justify-between">
                                                    <span className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        Est. Wait Time
                                                    </span>
                                                    <span className="font-bold">~{order.time_till_ready} mins</span>
                                                </div>
                                            )}

                                            <div className="space-y-2 border-t border-gray-50 pt-3">
                                                {order.order_items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm text-gray-600">
                                                        <span>{item.quantity}x {item.item_name}</span>
                                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "history" && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            {orderHistory.length === 0 ? (
                                <p className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">No order history found.</p>
                            ) : (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">Order ID</th>
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4">Items</th>
                                                <th className="px-6 py-4">Amount</th>
                                                <th className="px-6 py-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {orderHistory.map(order => (
                                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {order.order_items.length} items
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">${order.total_amount.toFixed(2)}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "reservations" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-900">Saved Tables</h2>
                                <Link href="/booking" className="text-sm font-bold text-orange-600 hover:underline flex items-center gap-1">
                                    <Plus className="w-4 h-4" />
                                    New Booking
                                </Link>
                            </div>

                            {reservations.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No reservations found.</p>
                                    <Link href="/booking" className="text-orange-600 font-bold mt-2 inline-block">Book a table now</Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {reservations.map(res => (
                                        <div key={res.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                                            <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl ${res.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                                res.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                                                    'bg-gray-100 text-gray-400'
                                                }`}>
                                                {res.status}
                                            </div>

                                            {res.is_reassigned && (
                                                <div className="mb-4 p-2 bg-yellow-50 text-yellow-800 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border border-yellow-100">
                                                    <XCircle className="w-3 h-3 text-yellow-600" />
                                                    Table moved from #{res.previous_table_number} to #{res.table_number}
                                                </div>
                                            )}

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-gray-900">
                                                    <Store className="w-5 h-5 text-orange-600" />
                                                    <span className="font-bold">{(res as any).outlet_name}</span>
                                                </div>

                                                <div className="flex items-center gap-3 text-gray-600 text-sm">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        {new Date(res.time_reserved_for).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3 text-gray-600 text-sm">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{new Date(res.time_reserved_for).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>

                                                <div className="flex items-center gap-3 text-gray-600 text-sm">
                                                    <Users className="w-4 h-4" />
                                                    <span>{res.number_of_guests} Guests (Table {res.table_number || res.table_id})</span>
                                                </div>
                                            </div>

                                            {res.status !== 'canceled' && (
                                                <button
                                                    onClick={() => handleCancelReservation(res.id)}
                                                    className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all text-xs font-bold border border-transparent group-hover:border-red-50"
                                                >
                                                    Cancel Booking
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Plus({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    );
}
