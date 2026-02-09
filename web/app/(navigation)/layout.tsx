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

    // Pages that handle their own navigation or are full-screen (like Home)
    const isHome = pathname === "/" || pathname === ROUTES.HOME;
    const isAuth = pathname === ROUTES.LOGIN || pathname === ROUTES.SIGNUP;