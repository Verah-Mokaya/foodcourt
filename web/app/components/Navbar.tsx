"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { Utensils, Menu, X, ShoppingBag, LogOut } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { ROUTES } from "@/app/lib/routes";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: ROUTES.HOME },
        { name: "Menu", href: ROUTES.MARKETPLACE },
        { name: "Outlets", href: ROUTES.OUTLETS }, // Point to new outlets page
    ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href={ROUTES.HOME} className="flex items-center gap-2 group">
                    <div className="bg-orange-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                        <Utensils className="h-6 w-6 text-white" />
                    </div>
                    <span className={cn("text-xl font-bold tracking-tight", scrolled ? "text-gray-900" : "text-white")}>
                        FoodCourt
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-orange-500",
                                scrolled ? "text-gray-600" : "text-gray-200"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            {user.role === "customer" && (
                                <Link href={ROUTES.CART} className={cn("p-2 rounded-full hover:bg-white/10 transition-colors", scrolled ? "text-gray-900" : "text-white")}>
                                    <ShoppingBag className="w-5 h-5" />
                                </Link>
                            )}
                            <div className="flex items-center gap-2">
                                <Link
                                    href={["owner", "outlet"].includes(user.role) ? ROUTES.DASHBOARD : ROUTES.PROFILE}
                                    className="bg-orange-600 !text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-orange-700 transition-colors"
                                >
                                    {["owner", "outlet"].includes(user.role) ? "Dashboard" : "My Profile"}
                                </Link>
                                <button
                                    onClick={logout}
                                    className={cn(
                                        "p-2 rounded-full transition-colors flex items-center justify-center",
                                        scrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/10"
                                    )}
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5 text-red-500" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link
                                href={ROUTES.LOGIN}
                                className={cn(
                                    "text-sm font-medium hover:text-orange-500 transition-colors",
                                    scrolled ? "text-gray-900" : "text-white"
                                )}
                            >
                                Sign In
                            </Link>
                            <Link
                                href={ROUTES.SIGNUP}
                                className="bg-white text-gray-900 px-5 py-2 rounded-full text-sm font-medium hover:bg-orange-50 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className={cn("w-6 h-6", scrolled ? "text-gray-900" : "text-white")} />
                    ) : (
                        <Menu className={cn("w-6 h-6", scrolled ? "text-gray-900" : "text-white")} />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-white shadow-lg p-6 border-t border-gray-100 md:hidden"
                    >
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gray-600 font-medium hover:text-orange-600"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-px bg-gray-100 my-2" />
                            {user ? (
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href={["owner", "outlet"].includes(user.role) ? ROUTES.DASHBOARD : ROUTES.PROFILE}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="bg-orange-600 !text-white py-3 rounded-xl text-center font-bold"
                                    >
                                        {["owner", "outlet"].includes(user.role) ? "Dashboard" : "My Profile"}
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex items-center justify-center gap-2 py-3 text-red-600 font-bold border border-red-100 rounded-xl"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Log Out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href={ROUTES.LOGIN}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-gray-900 font-medium text-center py-2"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href={ROUTES.SIGNUP}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="bg-orange-600 text-white py-3 rounded-xl text-center font-bold"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}