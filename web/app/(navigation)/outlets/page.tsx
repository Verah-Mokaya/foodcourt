"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/app/lib/api";
import { Outlet } from "@/app/lib/types";
import { ROUTES } from "@/app/lib/routes";
import Link from "next/link";
import { Store, ArrowRight, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function OutletsPage() {
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    const [isLoading, setIsLoading] = useState(true);