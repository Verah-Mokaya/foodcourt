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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar (Desktop) / Topbar (Mobile) - simplified for mobile focus but responsive */}
            <aside className="bg-white border-b md:border-r border-gray-200 md:w-64 md:min-h-screen p-4 flex md:flex-col justify-between items-center md:items-stretch">
                <Link href="/" className="flex items-center gap-2 mb-0 md:mb-8 hover:opacity-80 transition-opacity">
                    <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Utensils className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="font-bold text-lg hidden md:block">FC Partner</span>
                </Link>

                <nav className="flex md:flex-col gap-2">
                    <Link href="/features/Dashboard" className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors", pathname === "/features/Dashboard" ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-100")}>
                        <LayoutDashboard className="h-5 w-5" />
                        <span className="hidden md:block">Orders</span>
                    </Link>
                    <Link href="/features/Dashboard/Menu" className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors", pathname === "/features/Dashboard/Menu" ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-100")}>
                        <Utensils className="h-5 w-5" />
                        <span className="hidden md:block">Menu</span>
                    </Link>
                    <Link href="/features/Dashboard/Tables" className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors", pathname === "/features/Dashboard/Tables" ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-100")}>
                        <Grid3X3 className="h-5 w-5" />
                        <span className="hidden md:block">Tables</span>
                    </Link>
                </nav>

                <div className="md:mt-auto">
                    <button onClick={logout} className="flex items-center gap-3 px-3 py-2 w-full text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut className="h-5 w-5" />
                        <span className="hidden md:block">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-gray-900">
                        {pathname === "/features/Dashboard" ? "Live Orders" : pathname.includes("Menu") ? "Menu Management" : "Table Management"}
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Welcome, {user.name || user.first_name}</span>
                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                            {(user.name || user.first_name || "U").charAt(0)}
                        </div>
                    </div>
                    </header>
                {children}
            </main>
        </div>
    );
}