"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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