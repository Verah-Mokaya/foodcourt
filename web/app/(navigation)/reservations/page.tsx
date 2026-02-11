"use client";

import { useAuth } from "@/app/context/AuthContext";
import { fetcher, API_URL } from "@/app/lib/api";
import { useEffect, useState } from "react";
import { Calendar, Users, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/app/lib/routes";

interface Reservation {
    id: number;
    table_id: number;
    time_reserved_for: string;
    number_of_guests: number;
    status: string;
    created_at: string;
}

export default function ReservationsPage() {
    const { user } = useAuth();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadReservations = async () => {
        if (!user) return;
        try {
            const res = await fetcher<{ reservations: Reservation[] }>("/reservations/my");
            setReservations(res.reservations);
        } catch (err) {
            console.error("Failed to load reservations", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadReservations();
    }, [user]);

    const handleCancel = async (id: number) => {
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

    if (isLoading) return <div className="p-8 text-center text-white">Loading reservations...</div>;

    return (
        <div className="space-y-6 pb-20 max-w-4xl mx-auto p-4">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">My Reservations</h1>
                    <p className="text-gray-400 text-sm">Manage your table bookings here.</p>
                </div>
                <Link href="/booking" className="bg-orange-600 !text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700">
                    Book New Table
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reservations.length === 0 && (
                    <p className="text-gray-500 col-span-full text-center py-12">No reservations found.</p>
                )}

                {reservations.map(res => (
                    <div key={res.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl ${res.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                            res.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                                'bg-gray-100 text-gray-400'
                            }`}>
                            {res.status}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-900">
                                <Calendar className="w-5 h-5 text-orange-600" />
                                <span className="font-semibold">
                                    {new Date(res.time_reserved_for).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 text-gray-600">
                                <Clock className="w-5 h-5" />
                                <span>{new Date(res.time_reserved_for).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>

                            <div className="flex items-center gap-3 text-gray-600">
                                <Users className="w-5 h-5" />
                                <span>{res.number_of_guests} Guests (Table {res.table_id})</span>
                            </div>
                        </div>

                        {res.status !== 'canceled' && (
                            <button
                                onClick={() => handleCancel(res.id)}
                                className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium border border-transparent hover:border-red-100"
                            >
                                <XCircle className="w-4 h-4" />
                                Cancel Reservation
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}