"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/app/lib/routes";

export default function NavigationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isHome = pathname === "/" || pathname === ROUTES.HOME;
    const isAuth = pathname === ROUTES.LOGIN || pathname === ROUTES.SIGNUP;

    return (
        <div className="flex flex-col min-h-screen">
            {/* Show Navbar on all pages, but Home handles its own transparency */}
            {!isAuth && <Navbar />}
            <main className={`${!isHome && !isAuth ? "pt-20 flex-1 px-4 md:px-6 lg:px-8" : "flex-1"}`}>
                {children}
            </main>
            {!isAuth && <Footer />}
        </div>
    );
}