"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/app/lib/routes";

const slides = [
    {
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070",
        title: "Experience the Taste",
        subtitle: "Fresh, delicious meals from top rated outlets."
    },
    {
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070",
        title: "Culinary Delight",
        subtitle: "A world of flavors waiting for you."
    },
    {
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070",
        title: "Fast & Fresh",
        subtitle: "From kitchen to your table in minutes."
    }
];

export default function HeroSection() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden bg-gray-900">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slides[current].image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
                </motion.div>
            </AnimatePresence>

            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                <motion.div
                    key={`text-${current}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="max-w-3xl"
                >
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
                        {slides[current].title}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-100 mb-10 font-light">
                        {slides[current].subtitle}
                    </p>
                    <Link
                        href={ROUTES.MARKETPLACE}
                        className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all hover:gap-4 active:scale-95"
                    >
                        Order Now
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, idx) => (
                    <motion.button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        initial={false}
                        animate={{ width: current === idx ? 32 : 12 }}
                        className={`h-2 rounded-full transition-colors ${
                            current === idx ? "bg-blue-500" : "bg-white/40 hover:bg-white/60"
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}
