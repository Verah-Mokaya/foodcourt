"use client";

import { useAuth } from "@/context/AuthContext";
import { fetcher, API_URL } from "@/lib/api";
import { Table } from "@/lib/types";
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