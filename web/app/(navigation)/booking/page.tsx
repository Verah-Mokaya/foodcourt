"use client";

import { fetcher, API_URL } from "@/app/lib/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { Table } from "@/app/lib/types";
import { ROUTES } from "@/app/lib/routes";

export default function BookingPage() {

    const { user } = useAuth();
    const router = useRouter();
    const [tables, setTables] = useState<Table[]>([]);
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [guests, setGuests] = useState(2);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Fetch tables from backend endpoint
        fetcher<Table[]>("/food_court_tables").then(setTables).catch(console.error); // Updated endpoint to match TablesPage
    }, []);

    const handleBook = async () => {
        if (!selectedTable || !date || !time || !user) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("fc_token");
            const res = await fetch(`${API_URL}/reservations/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    table_id: selectedTable,
                    reservation_time: `${date}T${time}:00`,
                    number_of_guests: guests,
                    customer_id: user.id
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Booking failed");
            }
            alert("Table reserved!");
            router.push(ROUTES.ORDERS_HISTORY);
        } catch (e) {
            console.error(e);
            alert("Booking failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Book a Table</h1>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                        type="time"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm"
                        value={time}
                        onChange={e => setTime(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                    <input
                        type="number"
                        min="1"
                        max="20"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm"
                        value={guests}
                        onChange={e => setGuests(parseInt(e.target.value))}
                    />
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-3">Select a Table</h2>
                <div className="grid grid-cols-3 gap-3">
                    {tables.map(table => (
                        <button
                            key={table.id}
                            disabled={!table.is_available}
                            onClick={() => setSelectedTable(table.id)}
                            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${selectedTable === table.id
                                ? "bg-orange-600 text-white border-orange-600 ring-2 ring-orange-200"
                                : !table.is_available
                                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                    : "bg-white text-gray-900 border-gray-200 hover:border-orange-500"
                                }`}
                        >
                            <span className="font-bold text-lg">{table.table_number}</span>
                            <span className="text-xs opacity-80">{table.capacity} Seats</span>
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={handleBook}
                disabled={!selectedTable || !date || !time || isSubmitting}
                className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl disabled:opacity-50"
            >
                {isSubmitting ? "Booking..." : "Confirm Booking"}
            </button>
        </div>
    );
}