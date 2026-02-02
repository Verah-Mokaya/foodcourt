"use client";

import Navbar from "@/app/components/Navbar";
import Hero from "@/app/features/Home/components/Hero";
import BestSellers from "@/app/features/Home/components/BestSellers";
import Footer from "@/app/components/Footer";
import { ArrowRight, Star, Clock, Truck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ROUTES } from "@/app/lib/routes";

export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <Hero />
            <BestSellers />

            {/* How It Works Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-orange-600 font-bold uppercase tracking-wider text-sm">Simple Steps</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">How It Works</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-orange-100 -z-10" />

                        {[
                            { step: "01", title: "Choose Outlet", desc: "Browse our curated list of top restaurants." },
                            { step: "02", title: "Place Order", desc: "Select your favorites and customize your meal." },
                            { step: "03", title: "Track Food", desc: "Watch your food journey from kitchen to table." }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-6 text-center">
                                <div className="w-24 h-24 mx-auto bg-orange-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg mb-6 border-4 border-orange-100">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                                <p className="text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-orange-600 font-bold uppercase tracking-wider text-sm">Why Choose Us</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">Discover the FoodCourt Difference</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Star, title: "Top Rated Outlets", desc: "Curated selection of the best local restaurants." },
                            { icon: Clock, title: "Live Tracking", desc: "Watch your food journey from kitchen to table." },
                            { icon: Truck, title: "Fast Delivery", desc: "Hot and fresh food delivered in record time." }
                        ].map((feature, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                key={idx}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
                            >
                                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <feature.icon className="w-8 h-8 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-500">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Outlets Teaser */}
            <section className="py-20">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000"
                                alt="Restaurant Interior"
                                className="rounded-2xl shadow-2xl"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl hidden md:block border border-gray-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="text-orange-500 font-bold text-2xl">4.9</div>
                                    <div className="flex text-orange-400">
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm">Customer Rating</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-6">
                        <span className="text-orange-600 font-bold uppercase tracking-wider text-sm">Our Partners</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Dine with the Best</h2>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            We partner with the finest outlets to ensure every bite is a memory. From traditional cuisines to modern fusion, explore a world of variety.
                        </p>
                        <Link href={ROUTES.OUTLETS} className="inline-flex items-center gap-2 text-orange-600 font-bold hover:gap-3 transition-all">
                            View All Outlets <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-orange-600 text-white text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Order?</h2>
                    <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
                        Join thousands of happy customers and start your food journey today.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href={ROUTES.SIGNUP} className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors">
                            Get Started
                        </Link>
                        <Link href={ROUTES.LOGIN} className="border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors">
                            Login
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}