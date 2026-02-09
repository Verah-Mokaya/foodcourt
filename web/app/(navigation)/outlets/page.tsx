"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/app/lib/api";
import { Outlet } from "@/app/lib/types";
import { ROUTES } from "@/app/lib/routes";
import Link from "next/link";
import { Store, ArrowRight, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function OutletsPage() {
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadOutlets = async () => {
            try {
                const data = await fetcher<Outlet[]>("/outlets");
                setOutlets(data);
            } catch (err) {
                console.error("Failed to load outlets", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadOutlets();
    }, []);

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading fine restaurants...</div>;