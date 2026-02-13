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
        { name: "Home", href: "/" },
        { name: "Menu", href: "/marketplace" },
        { name: "Outlets", href: "/marketplace" },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled 
                    ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-4" 
                    : "bg-gradient-to-b from-gray-900/50 to-transparent py-6"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href={ROUTES.HOME} className="flex items-center gap-3 group">
                    <div className={cn(
                        "p-2 rounded-lg transition-all duration-300",
                        scrolled 
                            ? "bg-blue-600 group-hover:bg-blue-700" 
                            : "bg-white/20 backdrop-blur-sm group-hover:bg-white/30"
                    )}>
                        <Utensils className={cn(
                            "h-5 w-5 transition-colors",
                            scrolled ? "text-white" : "text-white"
                        )} />
                    </div>
                    <span className={cn(
                        "text-lg font-bold tracking-tight transition-colors duration-300",
                        scrolled ? "text-gray-900" : "text-white"
                    )}>
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
                                "text-sm font-medium transition-colors duration-300",
                                scrolled 
                                    ? "text-gray-700 hover:text-blue-600" 
                                    : "text-gray-100 hover:text-white"
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
                                <Link 
                                    href={ROUTES.CART} 
                                    className={cn(
                                        "p-2 rounded-lg transition-colors hover:bg-gray-100",
                                        scrolled ? "text-gray-700" : "text-white"
                                    )}
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                </Link>
                            )}
                            <div className="flex items-center gap-3">
                                <Link
                                    href={["owner", "outlet"].includes(user.role) ? ROUTES.DASHBOARD : ROUTES.CUSTOMER_DASHBOARD}
                                    className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={logout}
                                    className={cn(
                                        "p-2 rounded-lg transition-colors",
                                        scrolled 
                                            ? "text-gray-700 hover:bg-gray-100" 
                                            : "text-white hover:bg-white/10"
                                    )}
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link
                                href={ROUTES.LOGIN}
                                className={cn(
                                    "text-sm font-medium transition-colors",
                                    scrolled 
                                        ? "text-gray-700 hover:text-blue-600" 
                                        : "text-gray-100 hover:text-white"
                                )}
                            >
                                Sign In
                            </Link>
                            <Link
                                href={ROUTES.SIGNUP}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 hover:bg-gray-100/10 rounded-lg transition-colors"
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
                                    className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-px bg-gray-100 my-2" />
                            {user ? (
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href={["owner", "outlet"].includes(user.role) ? ROUTES.DASHBOARD : ROUTES.CUSTOMER_DASHBOARD}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="bg-blue-600 text-white py-2 rounded-lg text-center font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex items-center justify-center gap-2 py-2 text-gray-700 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
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
                                        className="text-gray-700 font-medium text-center py-2 hover:text-blue-600 transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href={ROUTES.SIGNUP}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="bg-blue-600 text-white py-2 rounded-lg text-center font-medium hover:bg-blue-700 transition-colors"
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
