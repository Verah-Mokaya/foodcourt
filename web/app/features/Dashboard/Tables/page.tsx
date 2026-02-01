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