"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, Utensils, LogOut, Grid3X3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && (!user || (user.role !== "owner" && user.role !== "outlet"))) {
            router.push("/features/Login");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) return null;