"use client";

import { Calendar, Users, Clock, CheckCircle, XCircle } from "lucide-react";

interface Reservation {
    id: number;
    customer_id: number;
    table_id: number;
    time_reserved_for: string;
    number_of_guests: number;
    status: string;
    created_at: string;
}

interface ReservationsTableProps {
    reservations: Reservation[];
}

export default function ReservationsTable({ reservations }: ReservationsTableProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                Reservations
            </h2>
            <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Customer ID</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Table</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Date & Time</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Guests</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {reservations.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">No reservations found.</td>
                            </tr>
                        )}
                        {reservations.map(res => (
                            <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 text-sm font-medium text-gray-900">#{res.customer_id}</td>
                                <td className="p-4 text-sm text-gray-600">Table {res.table_id}</td>
                                <td className="p-4 text-sm text-gray-600">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">
                                            {new Date(res.time_reserved_for).toLocaleDateString()}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(res.time_reserved_for).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {res.number_of_guests}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${res.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                            res.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-500'
                                        }`}>
                                        {res.status === 'confirmed' && <CheckCircle className="w-3 h-3" />}
                                        {res.status === 'canceled' && <XCircle className="w-3 h-3" />}
                                        {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
