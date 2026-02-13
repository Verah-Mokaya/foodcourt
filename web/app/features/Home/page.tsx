"use client";

import Hero from "@/app/features/Home/components/Hero";
import BestSellers from "@/app/features/Home/components/BestSellers";
import { ArrowRight, Star, Clock, Store } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ROUTES } from "@/app/lib/routes";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            <Hero />
            <BestSellers />

            {/* How It Works Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-blue-600 font-semibold uppercase tracking-widest text-xs">Simple Steps</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-3 text-gray-900">How It Works</h2>
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">Get your favorite food delivered in just three simple steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-24 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 -z-10" />

                        {[
                            { step: "01", title: "Choose Outlet", desc: "Browse our curated list of top restaurants and outlets." },
                            { step: "02", title: "Place Order", desc: "Select your favorites and customize your meal to perfection." },
                            { step: "03", title: "Track Food", desc: "Watch your food journey from kitchen to your table." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className="bg-gray-50 p-8 text-center rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                            >
                                <div className="w-20 h-20 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-blue-600 font-semibold uppercase tracking-widest text-xs">Why Choose Us</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-3 text-gray-900">Discover the FoodCourt Difference</h2>
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">Premium service, exceptional quality, and unbeatable value</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Star, title: "Top Rated Outlets", desc: "Curated selection of the best local restaurants and food vendors." },
                            { icon: Clock, title: "Live Tracking", desc: "Real-time updates as your order moves through preparation and delivery." },
                            { icon: Store, title: "Fast Delivery", desc: "Hot and fresh food delivered in record time, always on schedule." }
                        ].map((feature, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                key={idx}
                                className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md hover:border-blue-200 transition-all duration-300"
                            >
                                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <feature.icon className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Outlets Teaser */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1"
                    >
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000"
                                alt="Restaurant Interior"
                                className="rounded-xl shadow-lg"
                            />
                            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-xl border border-gray-200 hidden md:block">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="text-blue-600 font-bold text-2xl">4.9</div>
                                    <div className="flex text-blue-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-current" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm font-medium">Customer Rating</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1"
                    >
                        <span className="text-blue-600 font-semibold uppercase tracking-widest text-xs">Our Partners</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-3 text-gray-900">Dine with the Best</h2>
                        <p className="text-gray-600 mt-6 text-lg leading-relaxed">
                            We partner with the finest outlets to ensure every bite is a memorable experience. From traditional cuisines to modern fusion, explore a world of variety and quality.
                        </p>
                        <Link href={ROUTES.OUTLETS} className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all mt-8 text-lg group">
                            View All Outlets 
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-blue-600 text-white text-center">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Order?</h2>
                        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of happy customers and start your culinary journey today. Fast, fresh, and delicious food delivered right to you.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href={ROUTES.SIGNUP} className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-lg">
                                Get Started
                            </Link>
                            <Link href={ROUTES.LOGIN} className="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors text-lg">
                                Login
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
