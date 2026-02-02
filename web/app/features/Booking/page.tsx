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
    </div>
  );
}