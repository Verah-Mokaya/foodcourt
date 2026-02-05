"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, Utensils, LogOut, Grid3X3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { ROUTES } from "@/app/lib/routes";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && (!user || (user.role !== "owner" && user.role !== "outlet"))) {
            router.push(ROUTES.LOGIN);
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar (Desktop) / Topbar (Mobile) - simplified for mobile focus but responsive */}
            <aside className="bg-white border-b md:border-r border-gray-200 md:w-64 md:min-h-screen p-4 flex md:flex-col justify-between items-center md:items-stretch">
                <Link href={ROUTES.HOME} className="flex items-center gap-2 mb-0 md:mb-8 hover:opacity-80 transition-opacity">
                    <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Utensils className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="font-bold text-lg hidden md:block">FC Partner</span>
                </Link>

                <nav className="flex md:flex-col gap-2">
                    <Link href={ROUTES.DASHBOARD} className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors", pathname === ROUTES.DASHBOARD ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-100")}>
                        <LayoutDashboard className="h-5 w-5" />
                        <span className="hidden md:block">Orders</span>
                    </Link>
                    <Link href="/dashboard/menu" className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors", pathname === "/dashboard/menu" ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-100")}>
                        <Utensils className="h-5 w-5" />
                        <span className="hidden md:block">Menu</span>
                    </Link>
                    <Link href="/dashboard/reservations" className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors", pathname === "/dashboard/reservations" ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-100")}>
                        <Grid3X3 className="h-5 w-5" />
                        <span className="hidden md:block">Reservations</span>
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
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            {pathname === ROUTES.DASHBOARD ? "Live Orders" : pathname.includes("menu") ? "Menu Management" : "Reservations"}
                        </h1>
                        {user.outlet_name && (
                            <p className="text-sm text-gray-500 mt-1">
                                Managing <span className="font-semibold text-orange-600">{user.outlet_name}</span>
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900 leading-none">
                                {user.owner_name || user.name || "Owner"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                                {user.role}
                            </p>
                        </div>
                        <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-700 border border-orange-200 shadow-sm">
                            {(user.owner_name || user.name || "O").charAt(0)}
                        </div>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
}