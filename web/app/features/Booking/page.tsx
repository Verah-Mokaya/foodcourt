"use client";

import { fetcher, API_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Table } from "@/lib/types";

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
  );
}