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