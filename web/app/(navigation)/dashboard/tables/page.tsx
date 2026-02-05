"use client";

import { useAuth } from "@/app/context/AuthContext";
import { fetcher, API_URL } from "@/app/lib/api";
import { Table } from "@/app/lib/types";
import { useEffect, useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";

export default function TablesPage() {
    const { user } = useAuth();
    const [tables, setTables] = useState<Table[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newTable, setNewTable] = useState({ table_number: "", capacity: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadTables = async () => {
            try {
                // In a real app we'd filter by outlet, but mock data is global or we filter manually
                const res = await fetcher<Table[]>("/food_court_tables");
                // Since tables in this generic food court model might be shared or assigned, 
                // we'll just show all for now or assume they belong to the system. 
                // Ideally, we'd have `outlet_id` on tables if they were exclusive.
                // For this mock, let's just show all tables.
                setTables(res);
            } catch (err) {
                console.error("Failed to load tables", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadTables();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                table_number: Number(newTable.table_number),
                capacity: Number(newTable.capacity),
                is_available: true
            };

            const savedTable = await fetcher<Table>("/food_court_tables", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            setTables([...tables, savedTable]);
            setNewTable({ table_number: "", capacity: "" });
        } catch (err) {
            console.error("Failed to add table", err);
            alert("Failed to add table");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetcher(`/food_court_tables/${id}`, { method: "DELETE" });
            setTables(tables.filter(t => t.id !== id));
        } catch (err) {
            console.error("Failed to delete table", err);
            alert("Failed to delete table");
        }
    };

    if (isLoading) return <div className="p-8">Loading tables...</div>;

    return (
        <div className="space-y-8 max-w-4xl p-6">
            <h1 className="text-2xl font-bold text-gray-900">Table Management</h1>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold mb-4">Add New Table</h2>
                <form onSubmit={handleAdd} className="flex gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
                        <input
                            required
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={newTable.table_number}
                            onChange={e => setNewTable({ ...newTable, table_number: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                        <input
                            required
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={newTable.capacity}
                            onChange={e => setNewTable({ ...newTable, capacity: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Table
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tables.map(table => (
                    <div key={table.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-orange-100 p-3 rounded-full">
                                <span className="text-xl font-bold text-orange-600">{table.table_number}</span>
                            </div>
                            <button
                                onClick={() => handleDelete(Number(table.id))}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Users className="h-4 w-4" />
                            <span className="text-sm font-medium">{table.capacity} Seats</span>
                        </div>

                        <div className={`text-xs font-bold px-2 py-1 rounded-full w-fit ${table.is_available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}>
                            {table.is_available ? "Available" : "Occupied"}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
