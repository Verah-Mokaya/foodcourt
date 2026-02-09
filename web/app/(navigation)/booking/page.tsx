"use client";

import { fetcher } from "@/app/lib/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { Table, Outlet } from "@/app/lib/types";
import { ROUTES } from "@/app/lib/routes";
import { Calendar, Clock, Users, Store, Info, Loader2, CheckCircle2 } from "lucide-react";

export default function BookingPage() {
    
    const { user } = useAuth();
    const router = useRouter();
    const [tables, setTables] = useState<Table[]>([]);
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [selectedOutlet, setSelectedOutlet] = useState<number | null>(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [guests, setGuests] = useState(2);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadOutlets = async () => {
            try {
                const data = await fetcher<Outlet[]>("/outlets");
                setOutlets(data);
            } catch (err) {
                console.error("Failed to load outlets", err);
            }
        };
        loadOutlets();
    }, []);

    useEffect(() => {
        const loadTables = async () => {
            if (!selectedOutlet) return;
            try {
                // Fetch tables with availability context if possible
                const query = new URLSearchParams();
                query.append("outlet_id", selectedOutlet.toString());
                if (date) query.append("date", date);
                if (time) query.append("time", time);

                const data = await fetcher<Table[]>(`/reservations/food_court_tables?${query.toString()}`);
                setTables(data);
                setSelectedTable(null);
            } catch (err) {
                console.error("Failed to load tables", err);
            }
        };
        loadTables();
    }, [selectedOutlet, date, time]);

    const handleBook = async () => {
        if (!selectedTable || !selectedOutlet || !date || !time || !user) {
            alert("Please select an outlet, table, date, and time.");
            return;
        }

        // Additional validation
        if (guests < 1 || guests > 6) {
            alert("Guest count must be between 1 and 6.");
            return;
        }

        const selectedDateTime = new Date(`${date}T${time}`);
        if (selectedDateTime < new Date()) {
            alert("Cannot book for a past date or time.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetcher<any>("/reservations", {
                method: "POST",
                body: JSON.stringify({
                    outlet_id: selectedOutlet,
                    table_id: selectedTable,
                    time_reserved_for: `${date}T${time}:00`,
                    number_of_guests: guests,
                })
            });

            // Redirect to payment page with reservation ID
            router.push(`${ROUTES.RESERVATIONS_PAYMENT}?reservation_id=${res.reservation_id}`);
        } catch (e: any) {
            console.error(e);
            alert(e.error || "Booking failed. This table might already be reserved for the selected time.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
                <header>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Reserve a Table</h1>
                    <p className="text-gray-500 mt-2">Secure your spot and enjoy a seamless dining experience.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Form Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 text-gray-900 mb-2">
                                <div className="bg-orange-100 p-2 rounded-xl">
                                    <Store className="w-5 h-5 text-orange-600" />
                                </div>
                                <h2 className="font-bold text-lg">Where & When</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Select Outlet</label>
                                    <select
                                        className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 text-gray-900 font-medium transition-all"
                                        value={selectedOutlet || ""}
                                        onChange={e => setSelectedOutlet(Number(e.target.value))}
                                    >
                                        <option value="" disabled>Search Outlets...</option>
                                        {outlets.map(outlet => (
                                            <option key={outlet.id} value={outlet.id}>{outlet.outlet_name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="date"
                                                min={new Date().toISOString().split("T")[0]}
                                                className="w-full p-4 pl-12 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 text-gray-900 font-medium"
                                                value={date}
                                                onChange={e => setDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Time</label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="time"
                                                className="w-full p-4 pl-12 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 text-gray-900 font-medium"
                                                value={time}
                                                onChange={e => setTime(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Number of Guests (1-6)</label>
                                    <div className="relative">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            min="1"
                                            max="6"
                                            className="w-full p-4 pl-12 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 text-gray-900 font-medium"
                                            value={guests}
                                            onChange={e => setGuests(parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 text-gray-900 mb-6">
                                <div className="bg-blue-100 p-2 rounded-xl">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="font-bold text-lg">Select Your Table</h2>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {tables.map(table => (
                                    <button
                                        key={table.id}
                                        disabled={!table.is_available}
                                        onClick={() => setSelectedTable(Number(table.id))}
                                        className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${selectedTable === table.id
                                            ? "bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-200 scale-[1.02]"
                                            : !table.is_available
                                                ? "bg-gray-50 text-gray-300 border-gray-50 cursor-not-allowed"
                                                : "bg-white text-gray-900 border-gray-100 hover:border-orange-200"
                                            }`}
                                    >
                                        <span className="font-black text-xl">#{table.table_number}</span>
                                        <span className="text-[10px] font-bold uppercase opacity-60">{table.capacity} Seats</span>
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Summary & Confirmation */}
                    <div className="space-y-6">
                        <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl space-y-6 sticky top-24">
                            <h3 className="font-bold text-xl text-white">Booking Summary</h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                                    <span className="text-gray-300 text-sm">Reservation Fee</span>
                                    <span className="font-bold text-orange-400 text-lg">$5.00</span>
                                </div>

                                <div className="bg-gray-800/50 p-4 rounded-2xl space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-gray-300">
                                        <Info className="w-3 h-3 text-orange-400" />
                                        <span>Fee Policy</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 leading-relaxed">
                                        This fee is a deposit and will be automatically deducted from your food bill when you order at the outlet.
                                    </p>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>Instant Confirmation</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>Deductible Amount</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleBook}
                                disabled={!selectedTable || !selectedOutlet || !date || !time || isSubmitting}
                                className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-900/20 hover:bg-orange-500 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Complete Booking"
                                )}
                            </button>

                            <p className="text-[10px] text-center text-gray-500 px-4">
                                By confirming, you agree to our 15-minute grace period policy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}