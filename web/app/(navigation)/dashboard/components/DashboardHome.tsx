"use client";

import { Check, ChefHat, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardHomeProps {
    stats: {
        pending: number;
        preparing: number;
        ready: number;
    }
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

export default function DashboardHome({ stats }: DashboardHomeProps){
    const statCards = [
        { label: "Pending Orders", value: stats.pending, icon: Clock, color: "bg-blue-50 border-blue-200", textColor: "text-blue-700", iconColor: "text-blue-600" },
        { label: "Preparing", value: stats.preparing, icon: ChefHat, color: "bg-amber-50 border-amber-200", textColor: "text-amber-700", iconColor: "text-amber-600" },
        { label: "Ready for Pickup", value: stats.ready, icon: Check, color: "bg-green-50 border-green-200", textColor: "text-green-700", iconColor: "text-green-600" }
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
            {statCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                    <motion.div
                        key={idx}
                        variants={itemVariants}
                        className={`${card.color} p-6 rounded-lg border-2 shadow-sm hover:shadow-md transition-all duration-300`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium mb-2">{card.label}</p>
                                <p className={`text-4xl font-bold ${card.textColor}`}>{card.value}</p>
                            </div>
                            <div className={`${card.color} p-3 rounded-lg`}>
                                <Icon className={`w-6 h-6 ${card.iconColor}`} />
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
